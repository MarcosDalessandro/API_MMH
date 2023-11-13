import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { User } from 'src/users/entities/user.entity';
import { UserPayload } from './models/UserPayload';
import { JwtService } from '@nestjs/jwt';
import { UserToken } from './models/UserToken';

@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly userService: UsersService,
    ) { }

    async login(user: User): Promise<UserToken> {
        const payload: UserPayload = {
            sub: user.id,
            email: user.email,
            nick: user.nick,
        };

        return {
            access_token: this.jwtService.sign(payload),
        };
    }

    async validateUser(email: string, password: string): Promise<User> {
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

        throw new Error(
            'Email address or password provided is incorrect.',
        );
    }
}