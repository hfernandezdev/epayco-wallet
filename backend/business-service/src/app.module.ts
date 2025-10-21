import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HttpModule } from '@nestjs/axios';

import { ClientController } from './controllers/client.controller';
import { WalletController } from './controllers/wallet.controller';
import { PaymentController } from './controllers/payment.controller';

import { DatabaseHttpService } from './services/database-http.service';
import { DatabaseClientService } from './services/database-client.service';
import { PaymentService } from './services/payment.service';

@Module({
  imports: [
    HttpModule.register({
      baseURL: 'http://localhost:3001',
      timeout: 5000,
    }),
  ],
  controllers: [
    AppController,
    ClientController,
    WalletController,
    PaymentController,
  ],
  providers: [
    AppService,
    DatabaseHttpService,
    DatabaseClientService,
    PaymentService,
  ],
})
export class AppModule {}
