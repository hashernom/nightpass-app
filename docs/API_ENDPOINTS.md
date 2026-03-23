# NightPass API - Documentación de Endpoints

> Especificación completa de todos los endpoints REST de la API NightPass v1.0

**Base URL**: `https://api.nightpass.com/api/v1` (producción) o `http://localhost:3001/api/v1` (desarrollo)

## 📋 Índice

1. [Autenticación](#autenticación)
2. [Usuarios](#usuarios)
3. [Establecimientos (Venues)](#establecimientos-venues)
4. [Eventos](#eventos)
5. [Tickets](#tickets)
6. [Pagos](#pagos)
7. [Scanner](#scanner)
8. [Administración](#administración)
9. [Health Check](#health-check)

## 🔐 Autenticación

Todos los endpoints (excepto los públicos) requieren autenticación JWT. Incluir el token en el header:

```
Authorization: Bearer <token_jwt>
```

### POST `/auth/register`

Registra un nuevo usuario en el sistema.

**Request Body**:

```json
{
  "email": "usuario@ejemplo.com",
  "password": "ContraseñaSegura123",
  "name": "Juan Pérez",
  "role": "USER"
}
```

**Response** (201 Created):

```json
{
  "id": "uuid-del-usuario",
  "email": "usuario@ejemplo.com",
  "name": "Juan Pérez",
  "role": "USER",
  "createdAt": "2026-03-23T05:00:00.000Z"
}
```

### POST `/auth/login`

Inicia sesión y obtiene token JWT.

**Request Body**:

```json
{
  "email": "usuario@ejemplo.com",
  "password": "ContraseñaSegura123"
}
```

**Response** (200 OK):

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid-del-usuario",
    "email": "usuario@ejemplo.com",
    "name": "Juan Pérez",
    "role": "USER"
  }
}
```

### POST `/auth/refresh`

Obtiene un nuevo access token usando el refresh token.

**Request Body**:

```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### POST `/auth/logout`

Cierra la sesión del usuario (invalida el refresh token).

## 👤 Usuarios

### GET `/users/me`

Obtiene el perfil del usuario autenticado.

**Headers**: `Authorization: Bearer <token>`

**Response** (200 OK):

```json
{
  "id": "uuid-del-usuario",
  "email": "usuario@ejemplo.com",
  "name": "Juan Pérez",
  "role": "USER",
  "avatarUrl": "https://example.com/avatar.jpg",
  "createdAt": "2026-03-23T05:00:00.000Z",
  "updatedAt": "2026-03-23T05:00:00.000Z"
}
```

### PATCH `/users/me`

Actualiza el perfil del usuario autenticado.

**Request Body** (campos opcionales):

```json
{
  "name": "Nuevo Nombre",
  "avatarUrl": "https://nuevo-avatar.jpg"
}
```

## 🏢 Establecimientos (Venues)

### GET `/venues`

Lista todos los establecimientos activos (público).

**Query Parameters**:

- `city` (opcional): Filtrar por ciudad
- `page` (opcional): Número de página (default: 1)
- `limit` (opcional): Resultados por página (default: 20)

**Response** (200 OK):

```json
{
  "data": [
    {
      "id": "uuid-del-venue",
      "name": "Club Nocturno XYZ",
      "city": "Bogotá",
      "address": "Calle 123 #45-67",
      "capacity": 500,
      "coverImageUrl": "https://example.com/cover.jpg",
      "description": "El mejor club de la ciudad...",
      "isActive": true
    }
  ],
  "meta": {
    "total": 15,
    "page": 1,
    "limit": 20,
    "totalPages": 1
  }
}
```

### GET `/venues/:id`

Obtiene detalles de un establecimiento específico (público).

### POST `/venues`

Crea un nuevo establecimiento (requiere rol ADMIN_VENUE).

**Request Body**:

```json
{
  "name": "Nuevo Club",
  "city": "Medellín",
  "address": "Carrera 80 #12-34",
  "capacity": 300,
  "description": "Descripción del nuevo club..."
}
```

### PATCH `/venues/:id`

Actualiza un establecimiento (requiere rol ADMIN_VENUE y ser el propietario).

## 🎉 Eventos

### GET `/events`

Lista todos los eventos publicados (público).

**Query Parameters**:

- `venueId` (opcional): Filtrar por establecimiento
- `city` (opcional): Filtrar por ciudad
- `musicGenre` (opcional): Filtrar por género musical
- `dateFrom` (opcional): Fecha desde (ISO 8601)
- `dateTo` (opcional): Fecha hasta (ISO 8601)
- `status` (opcional): "PUBLISHED" (default), "DRAFT", "CANCELLED"

### GET `/events/:id`

Obtiene detalles completos de un evento (público).

**Response** (200 OK):

```json
{
  "id": "uuid-del-evento",
  "name": "Fiesta Electro 2026",
  "description": "La mejor fiesta electrónica del año...",
  "date": "2026-12-31T22:00:00.000Z",
  "doorsOpen": "2026-12-31T21:00:00.000Z",
  "coverPrice": 50000,
  "maxCapacity": 1000,
  "ticketsSold": 450,
  "musicGenre": "ELECTRONIC",
  "bannerImageUrl": "https://example.com/banner.jpg",
  "status": "PUBLISHED",
  "venue": {
    "id": "uuid-del-venue",
    "name": "Club Nocturno XYZ",
    "city": "Bogotá",
    "address": "Calle 123 #45-67"
  },
  "promotions": [
    {
      "id": "uuid-promo",
      "title": "Early Bird",
      "discountType": "PERCENT",
      "discountValue": 20,
      "code": "EARLY20",
      "validUntil": "2026-12-15T23:59:59.000Z"
    }
  ]
}
```

### POST `/events`

Crea un nuevo evento (requiere rol ADMIN_VENUE).

### PATCH `/events/:id/publish`

Publica un evento (cambia status de DRAFT a PUBLISHED).

### GET `/events/:id/stats`

Obtiene estadísticas de un evento (requiere rol ADMIN_VENUE y ser propietario).

## 🎫 Tickets

### POST `/tickets/checkout`

Inicia el proceso de compra de tickets (requiere rol USER).

**Request Body**:

```json
{
  "eventId": "uuid-del-evento",
  "quantity": 2,
  "promotionCode": "EARLY20"
}
```

**Response** (200 OK):

```json
{
  "checkoutSessionId": "cs_test_123456",
  "clientSecret": "pi_123456_secret_789",
  "amount": 80000,
  "currency": "COP"
}
```

### GET `/tickets/my`

Lista todos los tickets del usuario autenticado (requiere rol USER).

### GET `/tickets/:id`

Obtiene detalles de un ticket específico (requiere ser el propietario).

**Response** (200 OK):

```json
{
  "id": "uuid-del-ticket",
  "status": "ACTIVE",
  "qrToken": "nightpass_abc123def456",
  "qrSignedPayload": "HMAC_SHA256_SIGNATURE",
  "createdAt": "2026-03-23T05:00:00.000Z",
  "event": {
    "id": "uuid-del-evento",
    "name": "Fiesta Electro 2026",
    "date": "2026-12-31T22:00:00.000Z",
    "venue": {
      "name": "Club Nocturno XYZ",
      "address": "Calle 123 #45-67"
    }
  }
}
```

### POST `/tickets/validate`

Valida un QR en la puerta (requiere rol STAFF_SCANNER).

**Request Body**:

```json
{
  "qrToken": "nightpass_abc123def456"
}
```

**Response** (200 OK - acceso permitido):

```json
{
  "valid": true,
  "ticketId": "uuid-del-ticket",
  "userName": "Juan Pérez",
  "eventName": "Fiesta Electro 2026",
  "message": "Acceso permitido"
}
```

**Response** (400 Bad Request - QR inválido):

```json
{
  "valid": false,
  "error": "QR_EXPIRED",
  "message": "El QR ha expirado (TTL 24h)"
}
```

**Response** (409 Conflict - QR ya usado):

```json
{
  "valid": false,
  "error": "QR_ALREADY_USED",
  "message": "Este QR ya fue utilizado para entrar"
}
```

## 💳 Pagos

### GET `/payments/my`

Lista los pagos del usuario autenticado (requiere rol USER).

### GET `/payments/event/:eventId`

Lista los pagos de un evento específico (requiere rol ADMIN_VENUE y ser propietario).

### POST `/payments/webhook/stripe`

Webhook de Stripe (público, solo llamado por Stripe).

### POST `/payments/webhook/wompi`

Webhook de Wompi (público, solo llamado por Wompi).

## 📱 Scanner

### GET `/scanner/event/:eventId`

Obtiene información del evento para el scanner (requiere rol STAFF_SCANNER asignado al evento).

### GET `/scanner/logs/:eventId`

Obtiene los logs de escaneo de un evento (requiere rol STAFF_SCANNER o ADMIN_VENUE).

## 🏢 Administración

### GET `/admin/dashboard`

Obtiene el dashboard administrativo (requiere rol ADMIN_VENUE).

**Response** (200 OK):

```json
{
  "summary": {
    "totalEvents": 15,
    "activeEvents": 5,
    "totalTicketsSold": 1250,
    "totalRevenue": 62500000,
    "attendanceRate": 0.85
  },
  "recentSales": [
    {
      "eventName": "Fiesta Electro 2026",
      "ticketsSold": 45,
      "revenue": 2250000,
      "date": "2026-03-23T05:00:00.000Z"
    }
  ],
  "topEvents": [
    {
      "eventName": "Fiesta Electro 2026",
      "ticketsSold": 450,
      "capacity": 1000,
      "occupancyRate": 0.45
    }
  ]
}
```

### POST `/admin/staff/assign`

Asigna un staff scanner a un evento (requiere rol ADMIN_VENUE).

**Request Body**:

```json
{
  "userId": "uuid-del-usuario",
  "eventId": "uuid-del-evento",
  "role": "STAFF_SCANNER"
}
```

### GET `/admin/events/:eventId/attendance`

Obtiene reporte de asistencia de un evento (requiere rol ADMIN_VENUE).

## 🩺 Health Check

### GET `/health`

Verifica el estado del servidor (público).

**Response** (200 OK):

```json
{
  "status": "ok",
  "service": "NightPass API",
  "version": "1.0.0",
  "timestamp": "2026-03-23T05:00:00.000Z"
}
```

## 📊 Códigos de Error

| Código HTTP | Error Code                | Descripción                                  |
| ----------- | ------------------------- | -------------------------------------------- |
| 400         | `VALIDATION_ERROR`        | Error en validación de datos de entrada      |
| 401         | `UNAUTHORIZED`            | Token JWT inválido o expirado                |
| 403         | `FORBIDDEN`               | Usuario no tiene permisos para la operación  |
| 404         | `NOT_FOUND`               | Recurso no encontrado                        |
| 409         | `CONFLICT`                | Conflicto (ej: QR ya usado, email duplicado) |
| 422         | `BUSINESS_RULE_VIOLATION` | Violación de regla de negocio                |
| 429         | `RATE_LIMIT_EXCEEDED`     | Límite de requests excedido                  |
| 500         | `INTERNAL_SERVER_ERROR`   | Error interno del servidor                   |

## 🔒 Rate Limiting

La API implementa rate limiting por IP y por usuario:

- **Global**: 100 requests por minuto por IP
- **Login endpoints**: 5 intentos por minuto por IP
- **Checkout**: 3 requests por minuto por usuario
- **QR validation**: 10 requests por segundo por staff scanner

Los headers de respuesta incluyen:

- `X-RateLimit-Limit`: Límite total
- `X-RateLimit-Remaining`: Requests restantes
- `X-RateLimit-Reset`: Segundos hasta reset

## 📝 Convenciones

### Formatos de Fecha

Todas las fechas usan formato ISO 8601: `YYYY-MM-DDTHH:mm:ss.sssZ` (UTC)

### Paginación

Endpoints que devuelven listas usan paginación con query parameters:

- `page`: Número de página (1-based)
- `limit`: Items por página (default: 20, max: 100)

Respuesta incluye objeto `meta`:

```json
{
  "data": [...],
  "meta": {
    "total": 150,
    "page": 2,
    "limit": 20,
    "totalPages": 8
  }
}
```

### Ordenamiento

Usar query parameter `sort` con formato: `field:direction`

- Ejemplo: `?sort=createdAt:desc`
- Direcciones: `asc` (ascendente), `desc` (descendente)

### Filtros

Los filtros se aplican via query parameters:

- Igualdad: `?city=Bogotá`
- Rango: `?dateFrom=2026-01-01&dateTo=2026-12-31`
- Búsqueda parcial: `?name_like=electro`

## 🔗 Recursos Adicionales

- [Swagger UI](http://localhost:3001/api/docs) - Documentación interactiva
- [OpenAPI Spec](http://localhost:3001/api/docs-json) - Especificación OpenAPI 3.0
- [Postman Collection](docs/NightPass-API.postman_collection.json) - Colección para pruebas

---

_Última actualización: Marzo 2026 · NightPass API v1.0_
