import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Client } from '../schemas/client.schema';
import { CreateClientDto } from 'src/shared/dtos/create-client.dto';
import { FindClientDto } from 'src/shared/dtos/find-client.dto';

@Injectable()
export class ClientService {
  constructor(@InjectModel(Client.name) private clientModel: Model<Client>) {}

  async create(createClientDto: CreateClientDto) {
    try {
      const existingClient = await this.clientModel.findOne({
        $or: [
          { document: createClientDto.document },
          { email: createClientDto.email }
        ]
      });

      if (existingClient) {
        throw new ConflictException('Client already exists');
      }

      const client = new this.clientModel(createClientDto);
      await client.save();

      return {
        success: true,
        message: 'Client registered successfully',
        data: { clientId: client._id }
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
        error: 'CLIENT_REGISTRATION_FAILED'
      };
    }
  }

  async findByDocumentAndCellphone(findClientDto: FindClientDto) {
    try {
      const client = await this.clientModel.findOne({
        document: findClientDto.document,
        cellphone: findClientDto.cellphone
      });

      if (!client) {
        throw new NotFoundException('Client not found');
      }

      return {
        success: true,
        message: 'Client found successfully',
        data: client
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
        error: 'CLIENT_NOT_FOUND'
      };
    }
  }
}
