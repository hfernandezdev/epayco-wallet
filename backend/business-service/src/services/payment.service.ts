import { Injectable, Logger } from '@nestjs/common';
import { createTransport, createTestAccount, getTestMessageUrl } from 'nodemailer';
import { DatabaseClientService } from './database-client.service';
import { InitiatePaymentDto } from '../shared/dtos/initiate-payment.dto';
import { ConfirmPaymentDto } from '../shared/dtos/confirm-payment.dto';

interface PaymentSession {
  token: string;
  paymentData: InitiatePaymentDto;
  expiresAt: number;
  attempts: number;
}

@Injectable()
export class PaymentService {
  private readonly logger = new Logger(PaymentService.name);
  private sessions = new Map<string, PaymentSession>();
  private readonly MAX_ATTEMPTS = 3;
  private readonly SESSION_DURATION = 15 * 60 * 1000;

  constructor(private databaseClient: DatabaseClientService) {}

  async initiatePayment(paymentData: InitiatePaymentDto) {
    try {
      const clientResponse = await this.databaseClient.findClient({
        document: paymentData.document,
        cellphone: paymentData.cellphone
      });

      if (!clientResponse.success) {
        return {
          success: false,
          message: 'Client not found',
          error: 'CLIENT_NOT_FOUND'
        };
      }

      const balanceResponse = await this.databaseClient.getBalance({
        document: paymentData.document,
        cellphone: paymentData.cellphone
      });

      if (!balanceResponse.success) {
        return {
          success: false,
          message: 'Error checking balance',
          error: 'BALANCE_CHECK_FAILED'
        };
      }

      const currentBalance = balanceResponse.data.balance;
      if (currentBalance < paymentData.amount) {
        return {
          success: false,
          message: `Insufficient balance. Current: $${currentBalance}, Required: $${paymentData.amount}`,
          error: 'INSUFFICIENT_FUNDS'
        };
      }

      const token = this.generateToken();
      const sessionId = this.generateSessionId();

      this.sessions.set(sessionId, {
        token,
        paymentData,
        expiresAt: Date.now() + this.SESSION_DURATION,
        attempts: 0
      });

      this.logger.log(`Payment session created: ${sessionId} for client: ${paymentData.document}`);

      const emailSent = await this.sendTokenEmail(paymentData.email, token, sessionId);

      if (!emailSent) {
        this.sessions.delete(sessionId);
        return {
          success: false,
          message: 'Failed to send confirmation email',
          error: 'EMAIL_SEND_FAILED'
        };
      }

      return {
        success: true,
        message: 'Confirmation token sent to your email',
        data: {
          sessionId,
          expiresIn: '15 minutes'
        }
      };

    } catch (error) {
      this.logger.error(`Error initiating payment: ${error.message}`);
      return {
        success: false,
        message: 'Internal server error',
        error: 'INTERNAL_ERROR'
      };
    }
  }

  async confirmPayment(confirmationData: ConfirmPaymentDto) {
    try {
      const session = this.sessions.get(confirmationData.sessionId);

      if (!session) {
        return {
          success: false,
          message: 'Invalid or expired session',
          error: 'INVALID_SESSION'
        };
      }

      if (Date.now() > session.expiresAt) {
        this.sessions.delete(confirmationData.sessionId);
        return {
          success: false,
          message: 'Session expired',
          error: 'SESSION_EXPIRED'
        };
      }

      session.attempts++;
      if (session.attempts > this.MAX_ATTEMPTS) {
        this.sessions.delete(confirmationData.sessionId);
        return {
          success: false,
          message: 'Maximum attempts exceeded',
          error: 'MAX_ATTEMPTS_EXCEEDED'
        };
      }

      if (session.token !== confirmationData.token) {
        this.sessions.set(confirmationData.sessionId, session);
        return {
          success: false,
          message: `Invalid token. Attempts remaining: ${this.MAX_ATTEMPTS - session.attempts}`,
          error: 'INVALID_TOKEN'
        };
      }

      const debitResponse = await this.databaseClient.debitWallet({
        document: session.paymentData.document,
        cellphone: session.paymentData.cellphone,
        amount: session.paymentData.amount
      });

      this.sessions.delete(confirmationData.sessionId);

      if (!debitResponse.success) {
        this.logger.error(`Debit failed: ${debitResponse.message}`);
        return {
          success: false,
          message: 'Payment processing failed',
          error: 'PAYMENT_PROCESSING_FAILED'
        };
      }

      this.logger.log(`Payment confirmed successfully for client: ${session.paymentData.document}`);

      return {
        success: true,
        message: 'Payment confirmed successfully',
        data: {
          transactionId: debitResponse.data.transactionId,
          newBalance: debitResponse.data.newBalance,
          amount: session.paymentData.amount
        }
      };

    } catch (error) {
      this.logger.error(`Error confirming payment: ${error.message}`);
      return {
        success: false,
        message: 'Internal server error during payment confirmation',
        error: 'CONFIRMATION_ERROR'
      };
    }
  }

  private generateToken(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  private generateSessionId(): string {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 15);
    return `sess_${timestamp}_${random}`;
  }

  private async sendTokenEmail(email: string, token: string, sessionId: string): Promise<boolean> {
    try {
      const testAccount = await createTestAccount();

      const transporter = createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass
        },
        tls: {
          rejectUnauthorized: false
        }
      });

      const mailOptions = {
        from: '"ePayco Wallet" <noreply@epayco.com>',
        to: email,
        subject: 'Payment Confirmation Token',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333;">Payment Confirmation</h2>
            <p>Your payment confirmation token is:</p>
            <div style="background: #f4f4f4; padding: 15px; text-align: center; font-size: 24px; letter-spacing: 5px; font-weight: bold; margin: 20px 0;">
              ${token}
            </div>
            <p><strong>Session ID:</strong> ${sessionId}</p>
            <p><strong>Expires in:</strong> 15 minutes</p>
            <p><em>If you didn't initiate this payment, please ignore this email.</em></p>
          </div>
        `
      };

      const info = await transporter.sendMail(mailOptions);

      this.logger.log(`Token email sent to ${email}. Preview: ${getTestMessageUrl(info)}`);

      return true;
    } catch (error) {
      this.logger.error(`Failed to send email: ${error.message}`);
      return false;
    }
  }

  cleanupExpiredSessions(): number {
    const now = Date.now();
    let cleaned = 0;

    for (const [sessionId, session] of this.sessions.entries()) {
      if (now > session.expiresAt) {
        this.sessions.delete(sessionId);
        cleaned++;
      }
    }

    this.logger.log(`Cleaned up ${cleaned} expired sessions`);
    return cleaned;
  }
}
