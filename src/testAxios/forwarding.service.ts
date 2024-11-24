import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import axios, { AxiosError } from 'axios';

@Injectable()
export class ForwardingService {
  async forwardRequest(
    url: string,
    method: string,
    data?: any,
    headers?: any,
  ): Promise<any> {
    try {
      const response = await axios({
        url,
        method,
        data,
        headers,
      });
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;

      throw new HttpException(
        axiosError.response?.data || 'Erro ao repassar a requisição',
        axiosError.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
