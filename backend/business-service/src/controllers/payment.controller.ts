import { Controller, Post, Body } from '@nestjs/common';
import { PaymentService } from '../services/payment.service';
import { InitiatePaymentDto } from '../shared/dtos/initiate-payment.dto';
import { ConfirmPaymentDto } from '../shared/dtos/confirm-payment.dto';

@Controller('api/payments')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('initiate')
  async initiatePayment(@Body() paymentData: InitiatePaymentDto) {
    return await this.paymentService.initiatePayment(paymentData);
  }

  @Post('confirm')
  async confirmPayment(@Body() confirmationData: ConfirmPaymentDto) {
    return await this.paymentService.confirmPayment(confirmationData);
  }
}
