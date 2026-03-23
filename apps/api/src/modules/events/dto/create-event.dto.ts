import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsInt,
  IsOptional,
  IsDecimal,
  IsDateString,
  IsEnum,
  Min,
  Max,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { EventStatus } from '@prisma/client';
import { IsBefore } from '../../../shared/validators/is-before.validator';

export class CreateEventDto {
  @ApiProperty({
    example: 'Concierto de Rock',
    description: 'Nombre del evento',
  })
  @IsString()
  name!: string;

  @ApiProperty({ example: 'Un concierto increíble', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    example: '2024-12-31T20:00:00Z',
    description: 'Fecha y hora del evento',
  })
  @IsDateString()
  date!: string;

  @ApiProperty({
    example: '2024-12-31T19:00:00Z',
    description: 'Fecha y hora de apertura de puertas',
  })
  @IsDateString()
  @IsBefore('date')
  doorsOpen!: string;

  @ApiProperty({ example: 50.0, description: 'Precio de entrada' })
  @Transform(({ value }) => parseFloat(value))
  @IsDecimal({ decimal_digits: '2' })
  @Min(0)
  coverPrice!: number;

  @ApiProperty({ example: 1000, description: 'Capacidad máxima' })
  @IsInt()
  @Min(1)
  maxCapacity!: number;

  @ApiProperty({ example: 'Rock', description: 'Género musical' })
  @IsString()
  musicGenre!: string;

  @ApiProperty({ example: 'https://example.com/banner.jpg', required: false })
  @IsOptional()
  @IsString()
  bannerImageUrl?: string;

  @ApiProperty({
    example: 'DRAFT',
    enum: EventStatus,
    default: EventStatus.DRAFT,
  })
  @IsOptional()
  @IsEnum(EventStatus)
  status?: EventStatus = EventStatus.DRAFT;

  @ApiProperty({
    example: 'venue-id-uuid',
    description: 'ID del venue donde se realiza el evento',
  })
  @IsString()
  venueId!: string;
}
