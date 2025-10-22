import { Controller, Post, Body } from '@nestjs/common';
import { DatabaseHttpService } from '../services/database-http.service';
import { CreateClientDto } from 'src/shared/dtos/create-client.dto';
import { FindClientDto } from 'src/shared/dtos/find-client.dto';
import { ApiOperation, ApiResponse, ApiTags, ApiBody } from '@nestjs/swagger';
import { HttpStatus } from '@nestjs/common';

@ApiTags('Clientes')
@Controller('api/clients')
export class ClientController {
  constructor(private readonly databaseHttp: DatabaseHttpService) {}

  @Post('register')
  @ApiOperation({
    summary: 'Registrar nuevo cliente',
    description: 'Crea un nuevo cliente en el sistema con la información proporcionada. Todos los campos son obligatorios.'
  })
  @ApiBody({ type: CreateClientDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Cliente registrado exitosamente',
    schema: {
      example: {
        success: true,
        message: 'Client registered successfully',
        data: { clientId: '507f1f77bcf86cd799439011' }
      }
    }
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Error en los datos proporcionados',
    schema: {
      example: {
        success: false,
        message: 'Client already exists',
        error: 'CLIENT_ALREADY_EXISTS'
      }
    }
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Error interno del servidor',
    schema: {
      example: {
        success: false,
        message: 'Internal server error',
        error: 'INTERNAL_ERROR'
      }
    }
  })
  async createClient(@Body() clientData: CreateClientDto) {
    return await this.databaseHttp.post('/database/clients/register', clientData);
  }

  @Post('find')
  @ApiOperation({
    summary: 'Buscar cliente',
    description: 'Busca un cliente por documento y celular. Ambos campos deben coincidir.'
  })
  @ApiBody({ type: FindClientDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Cliente encontrado',
    schema: {
      example: {
        success: true,
        message: 'Client found',
        data: {
          document: '123456789',
          names: 'Juan Carlos Pérez',
          email: 'juan@example.com',
          cellphone: '3001234567'
        }
      }
    }
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Cliente no encontrado',
    schema: {
      example: {
        success: false,
        message: 'Client not found',
        error: 'CLIENT_NOT_FOUND'
      }
    }
  })
  async findClient(@Body() findData: FindClientDto) {
    return await this.databaseHttp.post('/database/clients/find', findData);
  }
}
