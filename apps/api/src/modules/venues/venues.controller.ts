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
import { VenuesService } from './venues.service';
import { CreateVenueDto } from './dto/create-venue.dto';
import { UpdateVenueDto } from './dto/update-venue.dto';
import { VenueQueryDto } from './dto/venue-query.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../../shared/enums';
import { CurrentUser } from '../../shared/decorators/current-user.decorator';

@ApiTags('venues')
@Controller('venues')
export class VenuesController {
  constructor(private readonly venuesService: VenuesService) {}

  @Get()
  @ApiOperation({ summary: 'Obtener lista de venues con filtros y paginación' })
  @ApiResponse({ status: 200, description: 'Lista de venues' })
  async findAll(@Query() query: VenueQueryDto) {
    return this.venuesService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un venue por ID con eventos próximos' })
  @ApiResponse({ status: 200, description: 'Detalle del venue' })
  @ApiResponse({ status: 404, description: 'Venue no encontrado' })
  async findOne(@Param('id') id: string) {
    return this.venuesService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN_VENUE)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Crear un nuevo venue (solo ADMIN_VENUE)' })
  @ApiResponse({ status: 201, description: 'Venue creado exitosamente' })
  @ApiResponse({ status: 403, description: 'No autorizado' })
  async create(
    @Body() createVenueDto: CreateVenueDto,
    @CurrentUser() user: any,
  ) {
    return this.venuesService.create(createVenueDto, user.id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Actualizar un venue (solo dueño del venue)' })
  @ApiResponse({ status: 200, description: 'Venue actualizado' })
  @ApiResponse({ status: 403, description: 'No autorizado' })
  @ApiResponse({ status: 404, description: 'Venue no encontrado' })
  async update(
    @Param('id') id: string,
    @Body() updateVenueDto: UpdateVenueDto,
    @CurrentUser() user: any,
  ) {
    return this.venuesService.update(id, updateVenueDto, user.id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar un venue (soft delete)' })
  @ApiResponse({ status: 204, description: 'Venue eliminado' })
  @ApiResponse({ status: 403, description: 'No autorizado' })
  @ApiResponse({ status: 404, description: 'Venue no encontrado' })
  async remove(@Param('id') id: string, @CurrentUser() user: any) {
    return this.venuesService.remove(id, user.id);
  }
}
