import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Client extends Document {
  @Prop({ required: true, unique: true })
  document: string;

  @Prop({ required: true })
  names: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  cellphone: string;

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const ClientSchema = SchemaFactory.createForClass(Client);
