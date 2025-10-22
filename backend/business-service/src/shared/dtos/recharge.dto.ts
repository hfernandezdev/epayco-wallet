import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber, Min } from 'class-validator';

export class RechargeDto {
  @ApiProperty({
    description: 'Documento del cliente',
    example: '123456789'
  })
  @IsString()
  @IsNotEmpty()
  document: string;

  @ApiProperty({
    description: 'Celular del cliente',
    example: '3001234567'
  })
  @IsString()
  @IsNotEmpty()
  cellphone: string;

  @ApiProperty({
    description: 'Valor a recargar en la billetera',
    example: 100.50,
    minimum: 1
  })
  @IsNumber()
  @Min(1)
  amount: number;
}
