import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class FindClientDto {
  @ApiProperty({
    description: 'Número de documento del cliente',
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
}
