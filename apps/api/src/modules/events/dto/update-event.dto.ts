import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsInt,
  IsOptional,
  IsDecimal,
  IsDateString,
  IsEnum,
  Min,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { EventStatus } from '@prisma/client';
import { PartialType } from '@nestjs/swagger';
import { CreateEventDto } from './create-event.dto';

export class UpdateEventDto extends PartialType(CreateEventDto) {
  // No permitir actualizar ticketsSold directamente
  @IsOptional()
  @IsInt()
  @Min(0)
  ticketsSold?: number;
}
