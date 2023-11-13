import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {

  constructor(@InjectRepository(User) private readonly usersRepo: Repository<User>) { }

  async create(createUserDto: CreateUserDto) {
    const user = {
      ...createUserDto,
      points: 0,
      senha: await bcrypt.hash(createUserDto.senha, 10),

    };
    const createUser = await this.usersRepo.save(user);
    return {
      ...createUser,
      senha: undefined,
    }

  };


  findAll() {
    return this.usersRepo.find();
  }

  async findOne(id: number) {
    const achou = await this.usersRepo.findOne({
      where: { id }
    });
    return {
      ...achou,
      senha: undefined,
    }
  }

  async findByEmail(email: string) {
    return await this.usersRepo.findOne({ where: { email: email } });
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

    return await this.usersRepo.remove(user);
  }

}
