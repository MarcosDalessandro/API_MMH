import { IsString, Length, IsInt, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateEntityDto {
    @IsString()
    @Length(1, 15, { message: 'Name must be between 1 and 15 characters' }) 
    name: string;

    @IsString()
    @Length(1, 15, { message: 'Type must be between 1 and 15 characters' })
    type: string;

    @IsNumber({}, { message: 'Height must be a number' })
    @IsNotEmpty({ message: 'Height is required' })
    height: number;

    @IsNumber({}, { message: 'Width must be a number' })
    @IsNotEmpty({ message: 'Width is required' })
    width: number;

    @IsString()
    @IsNotEmpty({ message: 'Category is required' })
    category: string;
}
