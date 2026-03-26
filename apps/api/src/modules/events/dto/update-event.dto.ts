import { IsInt, IsOptional, Min } from 'class-validator';
import { PartialType } from '@nestjs/swagger';
import { CreateEventDto } from './create-event.dto';

export class UpdateEventDto extends PartialType(CreateEventDto) {
  // No permitir actualizar ticketsSold directamente
  @IsOptional()
  @IsInt()
  @Min(0)
  ticketsSold?: number;
}
