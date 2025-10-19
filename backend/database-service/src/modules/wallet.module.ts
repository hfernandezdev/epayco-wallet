import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { WalletService } from '../services/wallet.service';
import { WalletController } from '../controllers/wallet.controller';
import { Client, ClientSchema } from '../schemas/client.schema';
import { Wallet, WalletSchema } from '../schemas/wallet.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Client.name, schema: ClientSchema },
      { name: Wallet.name, schema: WalletSchema }
    ])
  ],
  controllers: [WalletController],
  providers: [WalletService],
})
export class WalletModule {}
