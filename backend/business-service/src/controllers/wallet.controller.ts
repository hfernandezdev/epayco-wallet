import { Controller, Post, Body } from '@nestjs/common';
import { DatabaseHttpService } from '../services/database-http.service';
import { GetBalanceDto } from 'src/shared/dtos/get-balance.dto';
import { RechargeDto } from 'src/shared/dtos/recharge.dto';
import { DebitDto } from 'src/shared/dtos/debit.dto';
import { ApiOperation, ApiResponse, ApiTags, ApiBody } from '@nestjs/swagger';
import { HttpStatus } from '@nestjs/common';

@ApiTags('Billetera')
@Controller('api/wallet')
export class WalletController {
  constructor(private readonly databaseHttp: DatabaseHttpService) {}

  @Post('balance')
  @ApiOperation({
    summary: 'Consultar saldo',
    description: 'Obtiene el saldo actual de la billetera del cliente. Valida documento y celular.'
  })
  @ApiBody({ type: GetBalanceDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Saldo consultado exitosamente',
    schema: {
      example: {
        success: true,
        message: 'Balance retrieved successfully',
        data: {
          balance: 100.00
        }
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
  async getBalance(@Body() balanceData: GetBalanceDto) {
    return await this.databaseHttp.post('/database/wallet/balance', balanceData);
  }

  @Post('recharge')
  @ApiOperation({
    summary: 'Recargar billetera',
    description: 'Agrega saldo a la billetera del cliente. El cliente debe estar registrado previamente.'
  })
  @ApiBody({ type: RechargeDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Billetera recargada exitosamente',
    schema: {
      example: {
        success: true,
        message: 'Wallet recharged successfully',
        data: {
          newBalance: 150.50,
          transactionId: 'txn_abc123def456'
        }
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
    status: HttpStatus.BAD_REQUEST,
    description: 'Monto inválido',
    schema: {
      example: {
        success: false,
        message: 'Invalid amount',
        error: 'INVALID_AMOUNT'
      }
    }
  })
  async recharge(@Body() rechargeData: RechargeDto) {
    return await this.databaseHttp.post('/database/wallet/recharge', rechargeData);
  }

  @Post('debit')
  @ApiOperation({
    summary: 'Debitar billetera',
    description: 'Debita saldo de la billetera del cliente para un pago. Requiere validación por token.'
  })
  @ApiBody({ type: DebitDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Billetera debitada exitosamente',
    schema: {
      example: {
        success: true,
        message: 'Wallet debited successfully',
        data: {
          newBalance: 80.00,
          transactionId: 'txn_xyz789ghi012'
        }
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
    status: HttpStatus.BAD_REQUEST,
    description: 'Fondos insuficientes o token inválido',
    schema: {
      example: {
        success: false,
        message: 'Insufficient funds or invalid token',
        error: 'INSUFFICIENT_FUNDS_OR_INVALID_TOKEN'
      }
    }
  })
  async debit(@Body() debitData: DebitDto) {
    return await this.databaseHttp.post('/database/wallet/debit', debitData);
  }
}
