// Enums compartidos
export enum UserRole {
  USER = 'USER',
  STAFF_SCANNER = 'STAFF_SCANNER',
  ADMIN_VENUE = 'ADMIN_VENUE',
}

export enum AuthProvider {
  LOCAL = 'LOCAL',
  GOOGLE = 'GOOGLE',
  APPLE = 'APPLE',
}

export enum EventStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  CANCELLED = 'CANCELLED',
}

export enum TicketStatus {
  PENDING = 'PENDING',
  ACTIVE = 'ACTIVE',
  VALIDATED = 'VALIDATED',
  EXPIRED = 'EXPIRED',
  CANCELLED = 'CANCELLED',
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  SUCCEEDED = 'SUCCEEDED',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED',
  DISPUTED = 'DISPUTED',
}

export enum PaymentGateway {
  STRIPE = 'STRIPE',
  WOMPI = 'WOMPI',
  MERCADOPAGO = 'MERCADOPAGO',
}

export enum ScanResult {
  SUCCESS = 'SUCCESS',
  INVALID = 'INVALID',
  DUPLICATE = 'DUPLICATE',
  EXPIRED = 'EXPIRED',
}

// DTOs base
export interface UserDto {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatarUrl?: string;
  createdAt: Date;
}

export interface VenueDto {
  id: string;
  ownerId: string;
  name: string;
  city: string;
  address: string;
  capacity: number;
  description?: string;
  coverImageUrl?: string;
}

export interface EventDto {
  id: string;
  venueId: string;
  name: string;
  description?: string;
  date: Date;
  doorsOpen: Date;
  coverPrice: number;
  maxCapacity: number;
  ticketsSold: number;
  musicGenre: string;
  bannerImageUrl?: string;
  status: EventStatus;
}

export interface TicketDto {
  id: string;
  userId: string;
  eventId: string;
  paymentId: string;
  qrToken: string;
  status: TicketStatus;
  validatedAt?: Date;
  createdAt: Date;
}

export interface PaymentDto {
  id: string;
  userId: string;
  eventId: string;
  amount: number;
  currency: string;
  gateway: PaymentGateway;
  status: PaymentStatus;
  createdAt: Date;
}

// Response generico de la API
export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}
