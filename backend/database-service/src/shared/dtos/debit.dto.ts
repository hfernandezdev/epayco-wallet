import { IsString, IsNotEmpty, IsNumber, Min } from 'class-validator';

export class DebitDto {
  @IsString()
  @IsNotEmpty()
  document: string;

  @IsString()
  @IsNotEmpty()
  cellphone: string;

  @IsNumber()
  @Min(1)
  amount: number;
}
