import { IsString, IsEmail, Length, IsInt } from 'class-validator';

export class CreateUserDto {
    @IsString()
    @Length(1, 15) // Maximum length of 15 characters
    nick: string;

    @IsEmail()
    email: string;

    @IsString()
    @Length(1, 25) // Maximum length of 25 characters
    senha: string;

    @IsInt()
    points: number; // Removed @Min(0)
}
