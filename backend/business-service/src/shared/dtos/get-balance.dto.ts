import { IsString, IsNotEmpty } from 'class-validator';

export class GetBalanceDto {
  @IsString()
  @IsNotEmpty()
  document: string;

  @IsString()
  @IsNotEmpty()
  cellphone: string;
}
