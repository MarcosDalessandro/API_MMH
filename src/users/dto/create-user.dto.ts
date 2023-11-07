import { IsString, IsEmail, Length, IsInt, IsNotEmpty, IsNumber, Min } from 'class-validator';

export class CreateUserDto {
    @IsString()
    @Length(1, 15, { message: 'Nick must be between 1 and 15 characters' }) // Maximum length of 15 characters
    nick: string;

    @IsEmail({}, { message: 'Invalid email format' })
    email: string;

    @IsString()
    @Length(1, 25, { message: 'Senha must be between 1 and 25 characters' }) // Maximum length of 25 characters
    senha: string;

    @IsNumber({}, { message: 'Points must be a number' })
    points: number = 0; // Default value is 0
}
