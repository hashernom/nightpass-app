// Enums compartidos para evitar dependencias de @prisma/client o @nightpass/types
// Estos deben coincidir con los definidos en el schema.prisma

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
