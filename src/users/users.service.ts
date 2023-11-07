import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Repository } from 'typeorm';
import { Users } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(Users) private readonly usersRepo: Repository<Users>) { }

  async create(createUserDto: CreateUserDto) {
    const user = {
      ...createUserDto,
      senha: await bcrypt.hash(createUserDto.senha, 10)
    };
    const CreateUser = this.usersRepo.save(user);
    return {
      ...CreateUser,
      senha: undefined,
    }
  };


  async findAll() {
    return await this.usersRepo.find();
  }

  async findOne(id: number) {
    return await this.usersRepo.findOne({
      where: { id }
    });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {

    const user = await this.findOne(id);
    if (!user) {
      throw new NotFoundException();
    }

    Object.assign(user, updateUserDto)

    return await this.usersRepo.save(user);
  }

  async remove(id: number) {
    const user = await this.findOne(id);
    if (!user) {
      throw new NotFoundException();
    }

    return await this.usersRepo.remove;
  }
}
