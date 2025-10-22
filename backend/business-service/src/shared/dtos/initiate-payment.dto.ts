import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsEmail, IsNumber, Min, IsNotEmpty } from 'class-validator';

export class InitiatePaymentDto {
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
    description: 'Monto del pago',
    example: 50.75,
    minimum: 1
  })
  @IsNumber()
  @Min(1, { message: 'Amount must be greater than 0' })
  amount: number;

  @ApiProperty({
    description: 'Email donde se enviará el token de confirmación',
    example: 'cliente@example.com'
  })
  @IsEmail()
  email: string;

  @ApiPropertyOptional({
    description: 'Descripción opcional del pago',
    example: 'Pago por servicios mensuales',
    required: false
  })
  @IsString()
  @IsNotEmpty()
  description?: string;
}
