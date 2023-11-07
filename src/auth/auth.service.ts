import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(private readonly userService: UsersService) { }

    async validateUser(email: string, password: string) {
        const user = await this.userService.findByEmail(email);

        if (!user) {
            throw new Error('Email ou senha está errado');
        }

        const isPasswordValid = await bcrypt.compare(password, user.senha);

        if (!isPasswordValid) {
            throw new Error('Email ou senha está errado');
        }

        const { senha, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }

}

