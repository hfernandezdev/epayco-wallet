import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Wallet extends Document {
  @Prop({ required: true, unique: true })
  clientId: string;

  @Prop({ default: 0 })
  balance: number;

  @Prop({ default: Date.now })
  lastUpdate: Date;
}

export const WalletSchema = SchemaFactory.createForClass(Wallet);
