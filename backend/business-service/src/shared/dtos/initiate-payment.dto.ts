import { IsString, IsEmail, IsNumber, Min, IsNotEmpty } from 'class-validator';

export class InitiatePaymentDto {
  @IsString()
  @IsNotEmpty()
  document: string;

  @IsString()
  @IsNotEmpty()
  cellphone: string;

  @IsNumber()
  @Min(1, { message: 'Amount must be greater than 0' })
  amount: number;

  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  description?: string;
}
