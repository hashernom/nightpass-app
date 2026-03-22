import { z } from 'zod';

// Auth
export const RegisterSchema = z.object({
  name: z.string().min(2, 'Nombre debe tener al menos 2 caracteres'),
  email: z.string().email('Email invalido'),
  password: z
    .string()
    .min(8, 'Password debe tener al menos 8 caracteres')
    .regex(/[A-Z]/, 'Debe contener al menos una mayuscula')
    .regex(/[0-9]/, 'Debe contener al menos un numero'),
});

export const LoginSchema = z.object({
  email: z.string().email('Email invalido'),
  password: z.string().min(1, 'Password requerido'),
});

export type RegisterDto = z.infer<typeof RegisterSchema>;
export type LoginDto = z.infer<typeof LoginSchema>;

// Venue
export const CreateVenueSchema = z.object({
  name: z.string().min(2),
  city: z.string().min(2),
  address: z.string().min(5),
  capacity: z.number().int().positive(),
  description: z.string().optional(),
  coverImageUrl: z.string().url().optional(),
});

export type CreateVenueDto = z.infer<typeof CreateVenueSchema>;

// Event
export const CreateEventSchema = z.object({
  venueId: z.string().uuid(),
  name: z.string().min(2),
  description: z.string().optional(),
  date: z.coerce.date(),
  doorsOpen: z.coerce.date(),
  coverPrice: z.number().positive(),
  maxCapacity: z.number().int().positive(),
  musicGenre: z.string().min(2),
  bannerImageUrl: z.string().url().optional(),
});

export type CreateEventDto = z.infer<typeof CreateEventSchema>;

// Checkout
export const CheckoutSchema = z.object({
  eventId: z.string().uuid(),
  quantity: z.number().int().min(1).max(4),
  promotionCode: z.string().optional(),
});

export type CheckoutDto = z.infer<typeof CheckoutSchema>;

// QR Validate
export const ValidateQrSchema = z.object({
  qrToken: z.string().min(1),
});

export type ValidateQrDto = z.infer<typeof ValidateQrSchema>;

// Pagination
export const PaginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(50).default(20),
});

export type PaginationDto = z.infer<typeof PaginationSchema>;
