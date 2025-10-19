import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Client, ClientSchema } from '../schemas/client.schema';
import { Wallet, WalletSchema } from '../schemas/wallet.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Client.name, schema: ClientSchema },
      { name: Wallet.name, schema: WalletSchema },
    ]),
  ],
  exports: [MongooseModule],
})
export class DatabaseModule {}
