import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsInt,
  IsOptional,
  IsBoolean,
  IsUrl,
  Min,
  Max,
} from 'class-validator';

export class CreateVenueDto {
  @ApiProperty({ example: 'Teatro Nacional', description: 'Nombre del venue' })
  @IsString()
  name!: string;

  @ApiProperty({ example: 'Bogotá', description: 'Ciudad donde se encuentra' })
  @IsString()
  city!: string;

  @ApiProperty({
    example: 'Calle 123 #45-67',
    description: 'Dirección completa',
  })
  @IsString()
  address!: string;

  @ApiProperty({ example: 500, description: 'Capacidad máxima de personas' })
  @IsInt()
  @Min(1)
  capacity!: number;

  @ApiProperty({
    example: 'Un teatro histórico con excelente acústica',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 'https://example.com/cover.jpg', required: false })
  @IsOptional()
  @IsUrl()
  coverImageUrl?: string;

  @ApiProperty({ example: true, required: false, default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
