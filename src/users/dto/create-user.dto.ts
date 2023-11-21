import { IsString, IsEmail, Length, IsInt, IsNotEmpty, IsNumber, Min, isString } from 'class-validator';

export class CreateUserDto {
    @IsString()
    @Length(1, 15, { message: 'Nick must be between 1 and 15 characters' })
    nick: string;

    @IsEmail()
    email: string;

    @IsString()
    @Length(1, 25, { message: 'Senha must be between 1 and 25 characters' })
    senha: string;

    @IsNumber()
    points: number = 0;

}
