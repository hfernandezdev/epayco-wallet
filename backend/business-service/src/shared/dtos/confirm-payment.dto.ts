import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, Length } from 'class-validator';

export class ConfirmPaymentDto {
  @ApiProperty({
    description: 'ID de sesión generado al iniciar el pago',
    example: 'sess_k5j8d3h2m1n9p0q7'
  })
  @IsString()
  @IsNotEmpty()
  sessionId: string;

  @ApiProperty({
    description: 'Token de 6 dígitos enviado al email',
    example: '123456',
    minLength: 6,
    maxLength: 6
  })
  @IsString()
  @Length(6, 6, { message: 'Token must be exactly 6 digits' })
  token: string;
}
