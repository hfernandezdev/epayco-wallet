import { Controller, Post, Body } from '@nestjs/common';
import { DatabaseHttpService } from '../services/database-http.service';
import { CreateClientDto } from 'src/shared/dtos/create-client.dto';
import { FindClientDto } from 'src/shared/dtos/find-client.dto';

@Controller('api/clients')
export class ClientController {
  constructor(private readonly databaseHttp: DatabaseHttpService) {}

  @Post('register')
  async createClient(@Body() clientData: CreateClientDto) {
    return await this.databaseHttp.post('/database/clients/register', clientData);
  }

  @Post('find')
  async findClient(@Body() findData: FindClientDto) {
    return await this.databaseHttp.post('/database/clients/find', findData);
  }
}
