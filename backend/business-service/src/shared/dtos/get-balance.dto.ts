import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class GetBalanceDto {
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
}
