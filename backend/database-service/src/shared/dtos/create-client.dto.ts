import { IsString, IsNotEmpty, IsEmail } from 'class-validator';

export class CreateClientDto {
  @IsString()
  @IsNotEmpty()
  document: string;

  @IsString()
  @IsNotEmpty()
  names: string;

  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  cellphone: string;
}
