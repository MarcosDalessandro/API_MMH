import { Injectable } from '@nestjs/common';
import { CreateEntityDto } from './dto/create-entity.dto';
import { Repository } from 'typeorm';
import { Entities } from './entities/entity.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class EntitiesService {
  constructor(@InjectRepository(Entities) private readonly entitiesRepo: Repository<Entities>) { }
  
  async create(createEntityDto: CreateEntityDto) {

    const entities = this.entitiesRepo.create(createEntityDto);

    return await this.entitiesRepo.save(entities);
  }

  async findAll() {
    return await this.entitiesRepo.find();
  }

  async findOne(id: number) {
    return await this.entitiesRepo.findOne({
      where: { id }
    });
  }

}
