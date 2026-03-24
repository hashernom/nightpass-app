import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { CreateVenueDto } from './dto/create-venue.dto';
import { UpdateVenueDto } from './dto/update-venue.dto';
import { VenueQueryDto } from './dto/venue-query.dto';
import { UserRole } from '../../shared/enums';

@Injectable()
export class VenuesService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Obtiene lista de venues con filtros y paginación
   */
  async findAll(query: VenueQueryDto) {
    const { city, page = 1, limit = 20 } = query;
    const skip = (page - 1) * limit;

    const where: any = { isActive: true };
    if (city) {
      where.city = { contains: city, mode: 'insensitive' };
    }

    const [venues, total] = await Promise.all([
      this.prisma.venue.findMany({
        where,
        skip,
        take: limit,
        include: {
          owner: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.venue.count({ where }),
    ]);

    return {
      data: venues,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Obtiene un venue por ID incluyendo eventos próximos
   */
  async findOne(id: string) {
    const venue = await this.prisma.venue.findUnique({
      where: { id, isActive: true },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        events: {
          where: {
            status: 'PUBLISHED',
            date: { gte: new Date() },
          },
          take: 10,
          orderBy: { date: 'asc' },
          select: {
            id: true,
            name: true,
            date: true,
            doorsOpen: true,
            coverPrice: true,
            musicGenre: true,
            bannerImageUrl: true,
            ticketsSold: true,
            maxCapacity: true,
          },
        },
      },
    });

    if (!venue) {
      throw new NotFoundException(`Venue con ID ${id} no encontrado`);
    }

    return venue;
  }

  /**
   * Crea un nuevo venue (solo ADMIN_VENUE)
   * Nota: La verificación de rol se hace en el RolesGuard del controlador
   */
  async create(createVenueDto: CreateVenueDto, userId: string) {
    // El guard ya valida que el usuario tiene rol ADMIN_VENUE
    return this.prisma.venue.create({
      data: {
        ...createVenueDto,
        ownerId: userId,
      },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  /**
   * Actualiza un venue (solo dueño del venue)
   */
  async update(id: string, updateVenueDto: UpdateVenueDto, userId: string) {
    // Verificar que el venue existe y pertenece al usuario
    const venue = await this.prisma.venue.findUnique({
      where: { id },
      select: { ownerId: true },
    });

    if (!venue) {
      throw new NotFoundException(`Venue con ID ${id} no encontrado`);
    }

    if (venue.ownerId !== userId) {
      throw new ForbiddenException('No tienes permiso para editar este venue');
    }

    return this.prisma.venue.update({
      where: { id },
      data: updateVenueDto,
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  /**
   * Elimina un venue (soft delete)
   */
  async remove(id: string, userId: string) {
    const venue = await this.prisma.venue.findUnique({
      where: { id },
      select: { ownerId: true },
    });

    if (!venue) {
      throw new NotFoundException(`Venue con ID ${id} no encontrado`);
    }

    if (venue.ownerId !== userId) {
      throw new ForbiddenException(
        'No tienes permiso para eliminar este venue',
      );
    }

    return this.prisma.venue.update({
      where: { id },
      data: { isActive: false },
    });
  }
}
