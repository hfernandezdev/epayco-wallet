import { IsString, IsNotEmpty, Length } from 'class-validator';

export class ConfirmPaymentDto {
  @IsString()
  @IsNotEmpty()
  sessionId: string;

  @IsString()
  @Length(6, 6, { message: 'Token must be exactly 6 digits' })
  token: string;
}
