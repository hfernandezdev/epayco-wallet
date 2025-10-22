import { Controller, Post, Body } from '@nestjs/common';
import { PaymentService } from '../services/payment.service';
import { InitiatePaymentDto } from '../shared/dtos/initiate-payment.dto';
import { ConfirmPaymentDto } from '../shared/dtos/confirm-payment.dto';
import { ApiOperation, ApiResponse, ApiTags, ApiBody } from '@nestjs/swagger';
import { HttpStatus } from '@nestjs/common';

@ApiTags('Pagos')
@Controller('api/payments')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('initiate')
  @ApiOperation({
    summary: 'Iniciar proceso de pago',
    description: 'Inicia un proceso de pago generando un token de 6 dígitos que se envía al email del cliente. Valida saldo suficiente y existencia del cliente.'
  })
  @ApiBody({ type: InitiatePaymentDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Proceso de pago iniciado, token enviado por email',
    schema: {
      example: {
        success: true,
        message: 'Confirmation token sent to your email',
        data: {
          sessionId: 'sess_k5j8d3h2m1n9p0q7',
          expiresIn: '15 minutes'
        }
      }
    }
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Saldo insuficiente',
    schema: {
      example: {
        success: false,
        message: 'Insufficient balance. Current: $50.00, Required: $100.00',
        error: 'INSUFFICIENT_FUNDS'
      }
    }
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Cliente no encontrado',
    schema: {
      example: {
        success: false,
        message: 'Client not found',
        error: 'CLIENT_NOT_FOUND'
      }
    }
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Error al enviar el email',
    schema: {
      example: {
        success: false,
        message: 'Failed to send confirmation email',
        error: 'EMAIL_SEND_FAILED'
      }
    }
  })
  async initiatePayment(@Body() paymentData: InitiatePaymentDto) {
    return await this.paymentService.initiatePayment(paymentData);
  }

  @Post('confirm')
  @ApiOperation({
    summary: 'Confirmar pago con token',
    description: 'Confirma un pago utilizando el token de 6 dígitos recibido por email. Valida sesión y token antes de realizar el débito.'
  })
  @ApiBody({ type: ConfirmPaymentDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Pago confirmado exitosamente',
    schema: {
      example: {
        success: true,
        message: 'Payment confirmed successfully',
        data: {
          transactionId: 'txn_pay987654321',
          newBalance: 49.25,
          amount: 50.75
        }
      }
    }
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Token inválido',
    schema: {
      example: {
        success: false,
        message: 'Invalid token. Attempts remaining: 2',
        error: 'INVALID_TOKEN'
      }
    }
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Sesión expirada',
    schema: {
      example: {
        success: false,
        message: 'Session expired',
        error: 'SESSION_EXPIRED'
      }
    }
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Máximo de intentos excedido',
    schema: {
      example: {
        success: false,
        message: 'Maximum attempts exceeded',
        error: 'MAX_ATTEMPTS_EXCEEDED'
      }
    }
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Sesión no encontrada',
    schema: {
      example: {
        success: false,
        message: 'Invalid or expired session',
        error: 'INVALID_SESSION'
      }
    }
  })
  async confirmPayment(@Body() confirmationData: ConfirmPaymentDto) {
    return await this.paymentService.confirmPayment(confirmationData);
  }
}
