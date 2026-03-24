import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../../shared/prisma/prisma.service';
import { EventsService } from '../events.service';
import { CreateEventDto } from '../dto/create-event.dto';
import { UpdateEventDto } from '../dto/update-event.dto';
import { EventStatus, UserRole } from '@prisma/client';
import { describe, beforeEach, it, expect, vi } from 'vitest';

describe('EventsService', () => {
  let eventsService: EventsService;
  let prismaService: PrismaService;

  const mockPrismaService = {
    event: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
    user: {
      findUnique: vi.fn(),
    },
    venue: {
      findUnique: vi.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EventsService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    eventsService = module.get<EventsService>(EventsService);
    prismaService = module.get<PrismaService>(PrismaService);

    vi.clearAllMocks();
  });

  describe('findAll', () => {
    it('debería retornar una lista de eventos', async () => {
      const mockEvents = [
        {
          id: 'event-1',
          name: 'Evento 1',
          description: 'Descripción 1',
          coverPrice: 50.0,
          capacity: 100,
          status: EventStatus.DRAFT,
          venueId: 'venue-1',
          createdById: 'user-1',
          startsAt: new Date(),
          endsAt: new Date(),
        },
        {
          id: 'event-2',
          name: 'Evento 2',
          description: 'Descripción 2',
          coverPrice: 75.0,
          capacity: 200,
          status: EventStatus.PUBLISHED,
          venueId: 'venue-2',
          createdById: 'user-2',
          startsAt: new Date(),
          endsAt: new Date(),
        },
      ];

      mockPrismaService.event.findMany.mockResolvedValue(mockEvents);

      const query = { page: 1, limit: 10 };
      const result = await eventsService.findAll(query);

      expect(mockPrismaService.event.findMany).toHaveBeenCalled();
      expect(result).toEqual(mockEvents);
    });

    it('debería filtrar eventos por venueId si se proporciona', async () => {
      const mockEvents = [
        {
          id: 'event-1',
          name: 'Evento 1',
          venueId: 'venue-1',
        },
      ];

      mockPrismaService.event.findMany.mockResolvedValue(mockEvents);

      const query = { page: 1, limit: 10, venueId: 'venue-1' };
      await eventsService.findAll(query);

      expect(mockPrismaService.event.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            venueId: 'venue-1',
          }),
        }),
      );
    });
  });

  describe('findOne', () => {
    it('debería retornar un evento por ID', async () => {
      const mockEvent = {
        id: 'event-1',
        name: 'Evento Test',
        description: 'Descripción test',
        coverPrice: 50.0,
        capacity: 100,
        status: EventStatus.DRAFT,
        venueId: 'venue-1',
        createdById: 'user-1',
        startsAt: new Date(),
        endsAt: new Date(),
        venue: {
          id: 'venue-1',
          name: 'Venue Test',
        },
        createdBy: {
          id: 'user-1',
          name: 'Usuario Test',
        },
      };

      mockPrismaService.event.findUnique.mockResolvedValue(mockEvent);

      const result = await eventsService.findOne('event-1');

      expect(mockPrismaService.event.findUnique).toHaveBeenCalledWith({
        where: { id: 'event-1' },
        include: {
          venue: true,
          createdBy: true,
        },
      });
      expect(result).toEqual(mockEvent);
    });

    it('debería lanzar NotFoundException si el evento no existe', async () => {
      mockPrismaService.event.findUnique.mockResolvedValue(null);

      await expect(eventsService.findOne('non-existent-id')).rejects.toThrow(
        NotFoundException,
      );
      await expect(eventsService.findOne('non-existent-id')).rejects.toThrow(
        'Evento no encontrado',
      );
    });
  });

  describe('create', () => {
    it('debería crear un evento exitosamente', async () => {
      const createEventDto: CreateEventDto = {
        name: 'Nuevo Evento',
        description: 'Descripción del nuevo evento',
        venueId: 'venue-1',
        date: '2024-12-31T20:00:00Z',
        doorsOpen: '2024-12-31T19:00:00Z',
        coverPrice: 60.0,
        maxCapacity: 150,
        musicGenre: 'Rock',
      };

      const mockUser = {
        id: 'user-1',
        role: UserRole.ADMIN_VENUE,
      };

      const mockVenue = {
        id: 'venue-1',
        createdById: 'user-1', // Mismo usuario que crea el evento
      };

      const mockEvent = {
        id: 'new-event-id',
        name: createEventDto.name,
        description: createEventDto.description,
        venueId: createEventDto.venueId,
        date: createEventDto.date,
        doorsOpen: createEventDto.doorsOpen,
        coverPrice: createEventDto.coverPrice,
        maxCapacity: createEventDto.maxCapacity,
        musicGenre: createEventDto.musicGenre,
        status: EventStatus.DRAFT,
        createdById: 'user-1',
      };

      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
      mockPrismaService.venue.findUnique.mockResolvedValue(mockVenue);
      mockPrismaService.event.create.mockResolvedValue(mockEvent);

      const result = await eventsService.create(createEventDto, 'user-1');

      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id: 'user-1' },
      });
      expect(mockPrismaService.venue.findUnique).toHaveBeenCalledWith({
        where: { id: createEventDto.venueId },
      });
      expect(mockPrismaService.event.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          name: createEventDto.name,
          description: createEventDto.description,
          venueId: createEventDto.venueId,
          date: createEventDto.date,
          doorsOpen: createEventDto.doorsOpen,
          coverPrice: createEventDto.coverPrice,
          maxCapacity: createEventDto.maxCapacity,
          musicGenre: createEventDto.musicGenre,
          status: EventStatus.DRAFT,
          createdById: 'user-1',
        }),
      });
      expect(result).toEqual(mockEvent);
    });

    it('debería lanzar NotFoundException si el venue no existe', async () => {
      const createEventDto: CreateEventDto = {
        name: 'Nuevo Evento',
        description: 'Descripción',
        venueId: 'non-existent-venue',
        date: '2024-12-31T20:00:00Z',
        doorsOpen: '2024-12-31T19:00:00Z',
        coverPrice: 50.0,
        maxCapacity: 100,
        musicGenre: 'Rock',
      };

      const mockUser = {
        id: 'user-1',
        role: UserRole.ADMIN_VENUE,
      };

      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
      mockPrismaService.venue.findUnique.mockResolvedValue(null);

      await expect(
        eventsService.create(createEventDto, 'user-1'),
      ).rejects.toThrow(NotFoundException);
      await expect(
        eventsService.create(createEventDto, 'user-1'),
      ).rejects.toThrow('Venue no encontrado');
    });

    it('debería lanzar ForbiddenException si el usuario no es admin del venue', async () => {
      const createEventDto: CreateEventDto = {
        name: 'Nuevo Evento',
        description: 'Descripción',
        venueId: 'venue-1',
        date: '2024-12-31T20:00:00Z',
        doorsOpen: '2024-12-31T19:00:00Z',
        coverPrice: 50.0,
        maxCapacity: 100,
        musicGenre: 'Rock',
      };

      const mockUser = {
        id: 'user-1',
        role: UserRole.ADMIN_VENUE,
      };

      const mockVenue = {
        id: 'venue-1',
        createdById: 'different-user-id', // Diferente usuario
      };

      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
      mockPrismaService.venue.findUnique.mockResolvedValue(mockVenue);

      await expect(
        eventsService.create(createEventDto, 'user-1'),
      ).rejects.toThrow(ForbiddenException);
      await expect(
        eventsService.create(createEventDto, 'user-1'),
      ).rejects.toThrow('No tienes permisos para crear eventos en este venue');
    });
  });

  describe('update', () => {
    it('debería actualizar un evento exitosamente', async () => {
      const updateEventDto: UpdateEventDto = {
        name: 'Evento Actualizado',
        description: 'Descripción actualizada',
      };

      const mockEvent = {
        id: 'event-1',
        name: 'Evento Original',
        description: 'Descripción original',
        venueId: 'venue-1',
        createdById: 'user-1',
      };

      const mockUser = {
        id: 'user-1',
        role: UserRole.ADMIN_VENUE,
      };

      const mockUpdatedEvent = {
        ...mockEvent,
        ...updateEventDto,
      };

      mockPrismaService.event.findUnique.mockResolvedValue(mockEvent);
      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
      mockPrismaService.event.update.mockResolvedValue(mockUpdatedEvent);

      const result = await eventsService.update(
        'event-1',
        updateEventDto,
        'user-1',
      );

      expect(mockPrismaService.event.findUnique).toHaveBeenCalledWith({
        where: { id: 'event-1' },
      });
      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id: 'user-1' },
      });
      expect(mockPrismaService.event.update).toHaveBeenCalledWith({
        where: { id: 'event-1' },
        data: updateEventDto,
      });
      expect(result).toEqual(mockUpdatedEvent);
    });

    it('debería lanzar NotFoundException si el evento no existe', async () => {
      const updateEventDto: UpdateEventDto = {
        name: 'Evento Actualizado',
      };

      mockPrismaService.event.findUnique.mockResolvedValue(null);

      await expect(
        eventsService.update('non-existent-id', updateEventDto, 'user-1'),
      ).rejects.toThrow(NotFoundException);
      await expect(
        eventsService.update('non-existent-id', updateEventDto, 'user-1'),
      ).rejects.toThrow('Evento no encontrado');
    });
  });

  describe('remove', () => {
    it('debería eliminar un evento exitosamente', async () => {
      const mockEvent = {
        id: 'event-1',
        name: 'Evento a eliminar',
        venueId: 'venue-1',
        createdById: 'user-1',
      };

      const mockUser = {
        id: 'user-1',
        role: UserRole.ADMIN_VENUE,
      };

      mockPrismaService.event.findUnique.mockResolvedValue(mockEvent);
      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
      mockPrismaService.event.delete.mockResolvedValue(mockEvent);

      const result = await eventsService.remove('event-1', 'user-1');

      expect(mockPrismaService.event.findUnique).toHaveBeenCalledWith({
        where: { id: 'event-1' },
      });
      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id: 'user-1' },
      });
      expect(mockPrismaService.event.delete).toHaveBeenCalledWith({
        where: { id: 'event-1' },
      });
      expect(result).toEqual(mockEvent);
    });

    it('debería lanzar ForbiddenException si el usuario no es admin del venue', async () => {
      const mockEvent = {
        id: 'event-1',
        name: 'Evento',
        venueId: 'venue-1',
        createdById: 'different-user-id', // Diferente usuario
      };

      const mockUser = {
        id: 'user-1',
        role: UserRole.ADMIN_VENUE,
      };

      mockPrismaService.event.findUnique.mockResolvedValue(mockEvent);
      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);

      await expect(eventsService.remove('event-1', 'user-1')).rejects.toThrow(
        ForbiddenException,
      );
      await expect(eventsService.remove('event-1', 'user-1')).rejects.toThrow(
        'No tienes permisos para eliminar este evento',
      );
    });
  });
});
