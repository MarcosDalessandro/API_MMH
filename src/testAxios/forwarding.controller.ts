import { Controller, Get, Post, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { AxiosError } from 'axios';
import { EntitiesService } from 'src/entities/entities.service';
import { IsPublic } from 'src/auth/decorators/is-public.decorator';

@Controller('manual-forward')
export class ForwardingController {
  constructor(private readonly entitiesService: EntitiesService) { }

  @IsPublic()
  @Get()
  findAll() {
    return this.entitiesService.findAll();
  }

  @IsPublic()
  @Post()
  async forward(@Req() req: Request, @Res() res: Response) {
    try {
      // Redireciona para o método findAll
      const data = this.findAll();
      return res.json(data); // Retorna os dados encontrados
    } catch (error) {
      const axiosError = error as AxiosError;

      return res.status(axiosError.response?.status || 500).json({
        message: 'Erro ao repassar a requisição',
        details: axiosError.response?.data || axiosError.message,
      });
    }
  }
}
