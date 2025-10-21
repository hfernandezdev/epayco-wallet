import { Injectable, HttpException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class DatabaseHttpService {
  constructor(private readonly httpService: HttpService) {}

  async post(endpoint: string, data: any) {
    try {
      const response = await firstValueFrom(
        this.httpService.post(endpoint, data)
      );
      return response.data;
    } catch (error) {
      throw new HttpException(
        `Database service error: ${error.message}`,
        error.response?.status || 500
      );
    }
  }
}
