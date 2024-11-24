import { Module } from '@nestjs/common';
import { ForwardingController } from './forwarding.controller';
import { EntitiesModule } from '../entities/entities.module'; // Certifique-se de que o caminho está correto

@Module({
  imports: [EntitiesModule], // Importa o módulo que contém o EntitiesService
  controllers: [ForwardingController],
})
export class ForwardingModule {}
