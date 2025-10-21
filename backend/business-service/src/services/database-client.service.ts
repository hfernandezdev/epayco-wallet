import { Injectable, Inject } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { CreateClientDto } from 'src/shared/dtos/create-client.dto';
import { FindClientDto } from 'src/shared/dtos/find-client.dto';
import { RechargeDto } from 'src/shared/dtos/recharge.dto';
import { GetBalanceDto } from 'src/shared/dtos/get-balance.dto';
import { DebitDto } from 'src/shared/dtos/debit.dto';


@Injectable()
export class DatabaseClientService {
  constructor(private readonly httpService: HttpService) {}

  async createClient(clientData: CreateClientDto) {
    try {
      const response = await firstValueFrom(
        this.httpService.post('/database/clients', clientData)
      );
      return response.data;
    } catch (error) {
      throw new Error(`Database service error: ${error.message}`);
    }
  }

  async findClient(findData: FindClientDto) {
    try {
      const response = await firstValueFrom(
        this.httpService.post('/database/clients/find', findData)
      );
      return response.data;
    } catch (error) {
      throw new Error(`Database service error: ${error.message}`);
    }
  }

  async getBalance(balanceData: GetBalanceDto) {
    try {
      const response = await firstValueFrom(
        this.httpService.post('/database/wallet/balance', balanceData)
      );
      return response.data;
    } catch (error) {
      throw new Error(`Database service error: ${error.message}`);
    }
  }

  async rechargeWallet(rechargeData: RechargeDto) {
    try {
      const response = await firstValueFrom(
        this.httpService.post('/database/wallet/recharge', rechargeData)
      );
      return response.data;
    } catch (error) {
      throw new Error(`Database service error: ${error.message}`);
    }
  }

  async debitWallet(debitData: DebitDto) {
    try {
      const response = await firstValueFrom(
        this.httpService.post('/database/wallet/debit', debitData)
      );
      return response.data;
    } catch (error) {
      throw new Error(`Database service error: ${error.message}`);
    }
  }
}
