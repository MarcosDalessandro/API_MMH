import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { Column } from 'typeorm';

export class UpdateUserDto extends PartialType(CreateUserDto) {
    @Column({ unique: true })
    nick: string;

    @Column({ unique: true })
    email: string;

    @Column({ nullable: false })
    senha: string;

    @Column()
    points: number;
}
