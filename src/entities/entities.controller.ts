import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { EntitiesService } from './entities.service';
import { CreateEntityDto } from './dto/create-entity.dto';
import { IsPublic } from 'src/auth/decorators/is-public.decorator';

@Controller('entities')
export class EntitiesController {
  constructor(private readonly entitiesService: EntitiesService) { }

  @Post()
  create(@Body() createEntityDto: CreateEntityDto) {
    return this.entitiesService.create(createEntityDto);
  }

  @IsPublic()
  @Get()
  findAll() {
    return this.entitiesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.entitiesService.findOne(+id);
  }

}
