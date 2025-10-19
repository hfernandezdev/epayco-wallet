import { Controller, Post, Body, Query } from '@nestjs/common';
import { ClientService } from '../services/client.service';
import { CreateClientDto } from 'src/shared/dtos/create-client.dto';
import { FindClientDto } from 'src/shared/dtos/find-client.dto';

@Controller('database/clients')
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  @Post('register')
  async createClient(@Body() createClientDto: CreateClientDto) {
    return this.clientService.create(createClientDto);
  }

  @Post('find')
  async findClient(@Query() findClientDto: FindClientDto) {
    return this.clientService.findByDocumentAndCellphone(findClientDto);
  }
}
