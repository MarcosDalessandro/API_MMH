import { IsString, IsNumber } from 'class-validator';

export class ScaleRequestDto {
  @IsString()
  resourceType: string; // Por exemplo, "CPU" ou "MEMORY"

  @IsNumber()
  amount: number; // Quantidade de recursos a ajustar
}
