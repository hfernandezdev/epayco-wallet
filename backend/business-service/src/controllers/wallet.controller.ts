import { Controller, Post, Body } from '@nestjs/common';
import { DatabaseHttpService } from '../services/database-http.service';
import { GetBalanceDto } from 'src/shared/dtos/get-balance.dto';
import { RechargeDto } from 'src/shared/dtos/recharge.dto';
import { DebitDto } from 'src/shared/dtos/debit.dto';

@Controller('api/wallet')
export class WalletController {
  constructor(private readonly databaseHttp: DatabaseHttpService) {}

  @Post('balance')
  async getBalance(@Body() balanceData: GetBalanceDto) {
    return await this.databaseHttp.post('/database/wallet/balance', balanceData);
  }

  @Post('recharge')
  async recharge(@Body() rechargeData: RechargeDto) {
    return await this.databaseHttp.post('/database/wallet/recharge', rechargeData);
  }

  @Post('debit')
  async debit(@Body() debitData: DebitDto) {
    return await this.databaseHttp.post('/database/wallet/debit', debitData);
  }
}
