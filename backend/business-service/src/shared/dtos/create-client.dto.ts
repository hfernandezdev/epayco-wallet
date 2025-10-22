import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsEmail } from 'class-validator';

export class CreateClientDto {
  @ApiProperty({
    description: 'Número de documento de identidad del cliente',
    example: '123456789',
    minLength: 5,
    maxLength: 20
  })
  @IsString()
  @IsNotEmpty()
  document: string;

  @ApiProperty({
    description: 'Nombres completos del cliente',
    example: 'Juan Carlos Pérez García',
    minLength: 2,
    maxLength: 100
  })
  @IsString()
  @IsNotEmpty()
  names: string;

  @ApiProperty({
    description: 'Correo electrónico del cliente',
    example: 'juan.perez@example.com'
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Número de celular del cliente',
    example: '3001234567',
    minLength: 10,
    maxLength: 15
  })
  @IsString()
  @IsNotEmpty()
  cellphone: string;
}
