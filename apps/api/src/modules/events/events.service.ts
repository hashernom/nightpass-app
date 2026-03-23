import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { EventQueryDto } from './dto/event-query.dto';
import { UserRole, EventStatus } from '@prisma/client';

@Injectable()
export class EventsService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Obtiene lista de eventos con filtros y paginación (solo PUBLISHED)
   */
  async findAll(query: EventQueryDto) {
    const { city, genre, dateFrom, dateTo, page = 1, limit = 20 } = query;
    const skip = (page - 1) * limit;

    const where: any = {
      status: EventStatus.PUBLISHED,
    };

    if (city || genre) {
      where.venue = {};
      if (city) {
        where.venue.city = { contains: city, mode: 'insensitive' };
      }
      if (genre) {
        where.musicGenre = { contains: genre, mode: 'insensitive' };
      }
    }

    if (dateFrom || dateTo) {
      where.date = {};
      if (dateFrom) {
        where.date.gte = new Date(dateFrom);
      }
      if (dateTo) {
        where.date.lte = new Date(dateTo);
      }
    }

    const [events, total] = await Promise.all([
      this.prisma.event.findMany({
        where,
        skip,
        take: limit,
        include: {
          venue: {
            select: {
              id: true,
              name: true,
              city: true,
              address: true,
              coverImageUrl: true,
            },
          },
          promotions: {
            where: {
              isActive: true,
              validUntil: { gte: new Date() },
            },
            take: 3,
          },
        },
        orderBy: { date: 'asc' },
      }),
      this.prisma.event.count({ where }),
    ]);

    return {
      data: events,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Obtiene un evento por ID incluyendo promociones activas
   */
  async findOne(id: string) {
    const event = await this.prisma.event.findUnique({
      where: { id },
      include: {
        venue: {
          select: {
            id: true,
            name: true,
            city: true,
            address: true,
            capacity: true,
            coverImageUrl: true,
            owner: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
        promotions: {
          where: {
            isActive: true,
            validUntil: { gte: new Date() },
          },
          orderBy: { discountValue: 'desc' },
        },
      },
    });

    if (!event) {
      throw new NotFoundException(`Evento con ID ${id} no encontrado`);
    }

    return event;
  }

  /**
   * Crea un nuevo evento (solo ADMIN_VENUE, inicia en DRAFT)
   */
  async create(createEventDto: CreateEventDto, userId: string) {
    // Verificar que el usuario es ADMIN_VENUE y dueño del venue
    const venue = await this.prisma.venue.findUnique({
      where: { id: createEventDto.venueId },
      select: { ownerId: true },
    });

    if (!venue) {
      throw new NotFoundException(
        `Venue con ID ${createEventDto.venueId} no encontrado`,
      );
    }

    if (venue.ownerId !== userId) {
      throw new ForbiddenException('No eres el dueño de este venue');
    }

    // Crear evento
    return this.prisma.event.create({
      data: {
        ...createEventDto,
        date: new Date(createEventDto.date),
        doorsOpen: new Date(createEventDto.doorsOpen),
        ticketsSold: 0,
      },
      include: {
        venue: true,
      },
    });
  }

  /**
   * Actualiza un evento (solo dueño del venue)
   */
  async update(id: string, updateEventDto: UpdateEventDto, userId: string) {
    // Verificar que el evento existe y pertenece al usuario
    const event = await this.prisma.event.findUnique({
      where: { id },
      include: {
        venue: {
          select: { ownerId: true },
        },
      },
    });

    if (!event) {
      throw new NotFoundException(`Evento con ID ${id} no encontrado`);
    }

    if (event.venue.ownerId !== userId) {
      throw new ForbiddenException('No tienes permiso para editar este evento');
    }

    // RN-10: No editar coverPrice/maxCapacity con tickets vendidos
    if (updateEventDto.coverPrice !== undefined && event.ticketsSold > 0) {
      throw new BadRequestException(
        'No se puede modificar el precio de entrada cuando ya hay tickets vendidos',
      );
    }

    if (updateEventDto.maxCapacity !== undefined && event.ticketsSold > 0) {
      if (updateEventDto.maxCapacity < event.ticketsSold) {
        throw new BadRequestException(
          'La nueva capacidad no puede ser menor a los tickets ya vendidos',
        );
      }
    }

    // Convertir fechas si vienen
    const data: any = { ...updateEventDto };
    if (data.date) data.date = new Date(data.date);
    if (data.doorsOpen) data.doorsOpen = new Date(data.doorsOpen);

    return this.prisma.event.update({
      where: { id },
      data,
      include: {
        venue: true,
      },
    });
  }

  /**
   * Publicar un evento (cambiar status a PUBLISHED) con validación de campos obligatorios
   */
  async publish(id: string, userId: string) {
    const event = await this.prisma.event.findUnique({
      where: { id },
      include: {
        venue: {
          select: { ownerId: true },
        },
      },
    });

    if (!event) {
      throw new NotFoundException(`Evento con ID ${id} no encontrado`);
    }

    if (event.venue.ownerId !== userId) {
      throw new ForbiddenException(
        'No tienes permiso para publicar este evento',
      );
    }

    // RN-12: Validar campos obligatorios para publicar
    const requiredFields = [
      'name',
      'date',
      'doorsOpen',
      'coverPrice',
      'maxCapacity',
      'musicGenre',
      'bannerImageUrl',
    ];

    const missingFields = requiredFields.filter(
      (field) => !(event as any)[field],
    );
    if (missingFields.length > 0) {
      throw new BadRequestException(
        `Faltan campos obligatorios para publicar: ${missingFields.join(', ')}`,
      );
    }

    // Verificar que la fecha sea futura
    if (new Date(event.date) <= new Date()) {
      throw new BadRequestException('La fecha del evento debe ser futura');
    }

    // Verificar que doorsOpen sea anterior a date
    if (new Date(event.doorsOpen) >= new Date(event.date)) {
      throw new BadRequestException(
        'La apertura de puertas debe ser anterior a la fecha del evento',
      );
    }

    return this.prisma.event.update({
      where: { id },
      data: { status: EventStatus.PUBLISHED },
      include: {
        venue: true,
      },
    });
  }

  /**
   * Elimina un evento (soft delete)
   */
  async remove(id: string, userId: string) {
    const event = await this.prisma.event.findUnique({
      where: { id },
      include: {
        venue: {
          select: { ownerId: true },
        },
      },
    });

    if (!event) {
      throw new NotFoundException(`Evento con ID ${id} no encontrado`);
    }

    if (event.venue.ownerId !== userId) {
      throw new ForbiddenException(
        'No tienes permiso para eliminar este evento',
      );
    }

    // Si ya hay tickets vendidos, no se puede eliminar, solo cancelar
    if (event.ticketsSold > 0) {
      return this.prisma.event.update({
        where: { id },
        data: { status: EventStatus.CANCELLED },
      });
    }

    return this.prisma.event.delete({
      where: { id },
    });
  }
}
