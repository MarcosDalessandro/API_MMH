import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(private readonly userService: UsersService) { }

    async validateUser(email: string, password: string)  {
        const user = await this.userService.findByEmail(email);

        if (user) {
            const isPasswordValid = await bcrypt.compare(password, user.senha);
            if (isPasswordValid) {
                return {
                    ...user,
                    senha: undefined,
                };
            }
        }
        throw new Error('Email address or password provided is incorret.');
    }
}

