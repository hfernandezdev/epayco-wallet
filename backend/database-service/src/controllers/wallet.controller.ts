import { Controller, Post, Body } from '@nestjs/common';
import { WalletService } from '../services/wallet.service';
import { GetBalanceDto } from 'src/shared/dtos/get-balance.dto';
import { RechargeDto } from 'src/shared/dtos/recharge.dto';
import { DebitDto } from 'src/shared/dtos/debit.dto';

@Controller('database/wallet')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Post('balance')
  async getBalance(@Body() getBalanceDto: GetBalanceDto) {
    return this.walletService.getBalance(getBalanceDto);
  }

  @Post('recharge')
  async recharge(@Body() rechargeDto: RechargeDto) {
    return this.walletService.recharge(rechargeDto);
  }

  @Post('debit')
  async debit(@Body() debitDto: DebitDto) {
    return this.walletService.debit(debitDto);
  }
}
