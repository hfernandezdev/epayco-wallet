import { IsString, IsNotEmpty } from 'class-validator';

export class FindClientDto {
  @IsString()
  @IsNotEmpty()
  document: string;

  @IsString()
  @IsNotEmpty()
  cellphone: string;
}
