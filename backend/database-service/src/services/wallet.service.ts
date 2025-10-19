import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Client } from '../schemas/client.schema';
import { Wallet } from '../schemas/wallet.schema';
import { GetBalanceDto } from '../shared/dtos/get-balance.dto';
import { RechargeDto } from '../shared/dtos/recharge.dto';
import { DebitDto } from '../shared/dtos/debit.dto';

@Injectable()
export class WalletService {
  constructor(
    @InjectModel(Client.name) private clientModel: Model<Client>,
    @InjectModel(Wallet.name) private walletModel: Model<Wallet>,
  ) {}

  async getBalance(getBalanceDto: GetBalanceDto) {
    try {
      const client = await this.clientModel.findOne({
        document: getBalanceDto.document,
        cellphone: getBalanceDto.cellphone
      });

      if (!client) {
        throw new NotFoundException('Client not found');
      }

      let wallet = await this.walletModel.findOne({ clientId: client._id });

      if (!wallet) {
        wallet = await this.walletModel.create({
          clientId: client._id,
          balance: 0
        });
      }

      return {
        success: true,
        message: 'Balance retrieved successfully',
        data: {
          balance: wallet.balance,
          client: client.names
        }
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
        error: 'BALANCE_QUERY_FAILED'
      };
    }
  }

  async recharge(rechargeDto: RechargeDto) {
    try {
      const client = await this.clientModel.findOne({
        document: rechargeDto.document,
        cellphone: rechargeDto.cellphone
      });

      if (!client) {
        throw new NotFoundException('Client not found');
      }

      let wallet = await this.walletModel.findOne({ clientId: client._id });
      if (!wallet) {
        wallet = await this.walletModel.create({
          clientId: client._id,
          balance: rechargeDto.amount
        });
      } else {
        wallet.balance += rechargeDto.amount;
        await wallet.save();
      }

      return {
        success: true,
        message: 'Wallet recharged successfully',
        data: {
          newBalance: wallet.balance,
          client: client.names
        }
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
        error: 'RECHARGE_FAILED'
      };
    }
  }

  async debit(debitDto: DebitDto) {
    try {
      const client = await this.clientModel.findOne({
        document: debitDto.document,
        cellphone: debitDto.cellphone
      });

      if (!client) {
        throw new NotFoundException('Client not found');
      }

      const wallet = await this.walletModel.findOne({ clientId: client._id });

      if (!wallet) {
        throw new BadRequestException('Wallet not found');
      }

      if (wallet.balance < debitDto.amount) {
        throw new BadRequestException('Insufficient balance');
      }

      wallet.balance -= debitDto.amount;
      await wallet.save();

      return {
        success: true,
        message: 'Amount debited successfully',
        data: {
          newBalance: wallet.balance,
          client: client.names
        }
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
        error: 'DEBIT_FAILED'
      };
    }
  }
}
