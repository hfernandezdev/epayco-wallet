import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber, Min } from 'class-validator';

export class DebitDto {
  @ApiProperty({
    description: 'Documento del cliente',
    example: '123456789'
  })
  @IsString()
  @IsNotEmpty()
  document: string;

  @ApiProperty({
    description: 'Número de celular del cliente',
    example: '3001234567'
  })
  @IsString()
  @IsNotEmpty()
  cellphone: string;

  @ApiProperty({
    description: 'Monto del pago',
    example: 50.75,
    minimum: 1
  })
  @IsNumber()
  @Min(1)
  amount: number;
}
