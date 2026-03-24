import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { EventQueryDto } from './dto/event-query.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../../shared/enums';
import { CurrentUser } from '../../shared/decorators/current-user.decorator';

@ApiTags('events')
@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Get()
  @ApiOperation({
    summary:
      'Obtener lista de eventos con filtros y paginación (solo PUBLISHED)',
  })
  @ApiResponse({ status: 200, description: 'Lista de eventos' })
  async findAll(@Query() query: EventQueryDto) {
    return this.eventsService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un evento por ID con promociones activas' })
  @ApiResponse({ status: 200, description: 'Detalle del evento' })
  @ApiResponse({ status: 404, description: 'Evento no encontrado' })
  async findOne(@Param('id') id: string) {
    return this.eventsService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN_VENUE)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Crear un nuevo evento (solo ADMIN_VENUE, inicia en DRAFT)',
  })
  @ApiResponse({ status: 201, description: 'Evento creado exitosamente' })
  @ApiResponse({ status: 403, description: 'No autorizado' })
  async create(
    @Body() createEventDto: CreateEventDto,
    @CurrentUser() user: any,
  ) {
    return this.eventsService.create(createEventDto, user.id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Actualizar un evento (solo dueño del venue)' })
  @ApiResponse({ status: 200, description: 'Evento actualizado' })
  @ApiResponse({ status: 403, description: 'No autorizado' })
  @ApiResponse({ status: 404, description: 'Evento no encontrado' })
  async update(
    @Param('id') id: string,
    @Body() updateEventDto: UpdateEventDto,
    @CurrentUser() user: any,
  ) {
    return this.eventsService.update(id, updateEventDto, user.id);
  }

  @Patch(':id/publish')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary:
      'Publicar un evento (cambiar status a PUBLISHED) con validación de campos obligatorios',
  })
  @ApiResponse({ status: 200, description: 'Evento publicado' })
  @ApiResponse({ status: 400, description: 'Faltan campos obligatorios' })
  @ApiResponse({ status: 403, description: 'No autorizado' })
  @ApiResponse({ status: 404, description: 'Evento no encontrado' })
  async publish(@Param('id') id: string, @CurrentUser() user: any) {
    return this.eventsService.publish(id, user.id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar un evento (soft delete)' })
  @ApiResponse({ status: 204, description: 'Evento eliminado' })
  @ApiResponse({ status: 403, description: 'No autorizado' })
  @ApiResponse({ status: 404, description: 'Evento no encontrado' })
  async remove(@Param('id') id: string, @CurrentUser() user: any) {
    return this.eventsService.remove(id, user.id);
  }
}
