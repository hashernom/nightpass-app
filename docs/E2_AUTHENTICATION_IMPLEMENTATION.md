# E2 - Implementación de Autenticación

## Resumen

Implementación completa del módulo de autenticación para NightPass, incluyendo:

1. Login local con email/password y RBAC de 3 roles
2. OAuth Google con Passport.js y JWT RS256

## Estructura de Archivos

### Módulo de Autenticación (`apps/api/src/modules/auth/`)

```
auth/
├── auth.constants.ts          # Constantes de configuración
├── auth.module.ts            # Módulo principal
├── auth.service.ts           # Lógica de negocio
├── auth.controller.ts        # Endpoints públicos de auth
├── users.controller.ts       # Endpoints protegidos de usuarios
├── dto/                      # Data Transfer Objects
│   ├── register.dto.ts
│   ├── login.dto.ts
│   └── tokens.dto.ts
├── strategies/               # Estrategias de Passport
│   ├── jwt.strategy.ts
│   ├── google.strategy.ts
│   └── jwt-rsa.config.ts
├── guards/                   # Guards de NestJS
│   ├── jwt-auth.guard.ts
│   └── roles.guard.ts
└── decorators/               # Decorators personalizados
    └── roles.decorator.ts
```

## Endpoints Implementados

### Autenticación Pública

- `POST /auth/register` - Registro con email/password (bcrypt salt rounds: 12)
- `POST /auth/login` - Login con validación de credenciales (rate limit: 5 intentos/15min)
- `GET /auth/google` - Iniciar autenticación con Google OAuth
- `GET /auth/google/callback` - Callback de Google OAuth
- `POST /auth/refresh` - Refrescar access token
- `POST /auth/logout` - Cerrar sesión

### Usuarios (Protegidos)

- `GET /users/me` - Obtener información del usuario actual
- `PATCH /users/me` - Actualizar información del usuario
- `GET /users/admin-only` - Solo para ADMIN_VENUE (ejemplo RBAC)
- `GET /users/staff-only` - Solo para STAFF_SCANNER o ADMIN_VENUE
- `GET /users/user-only` - Solo para USER

## Configuración JWT

### Opción 1: HS256 (Desarrollo)

```env
JWT_SECRET=your-super-secret-key
```

### Opción 2: RS256 (Producción - Recomendado)

```env
JWT_PRIVATE_KEY=-----BEGIN RSA PRIVATE KEY-----\n...\n-----END RSA PRIVATE KEY-----
JWT_PUBLIC_KEY=-----BEGIN PUBLIC KEY-----\n...\n-----END PUBLIC KEY-----
```

### Generar Claves RSA

```bash
node scripts/generate-jwt-keys.js
```

## Configuración Google OAuth

```env
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret
GOOGLE_CALLBACK_URL=http://localhost:3000/auth/google/callback
```

## RBAC (Role-Based Access Control)

### Roles Definidos

1. **USER** - Usuario final que compra tickets
2. **STAFF_SCANNER** - Staff que valida QR en puerta
3. **ADMIN_VENUE** - Administrador del establecimiento

### Uso de Decorators

```typescript
@Roles(UserRole.ADMIN_VENUE)        // Solo administradores
@Roles(UserRole.STAFF_SCANNER, UserRole.ADMIN_VENUE) // Staff o admin
@Roles(UserRole.USER)               // Solo usuarios regulares
```

## Seguridad Implementada

### 1. Rate Limiting

- Máximo 5 intentos de login por IP cada 15 minutos
- Implementado con `@nestjs/throttler`

### 2. Hash de Contraseñas

- Bcrypt con 12 salt rounds
- Almacenamiento seguro en base de datos

### 3. Tokens JWT

- Access token: 15 minutos de expiración
- Refresh token: 7 días (almacenado en cookie HttpOnly)
- Algoritmo: RS256 (asimétrico) o HS256 (desarrollo)

### 4. Cookies Seguras

- HttpOnly: true (inaccesible desde JavaScript)
- Secure: true (solo HTTPS en producción)
- SameSite: Strict (protección CSRF)
- Path: / (disponible en toda la aplicación)

### 5. Validación de Input

- Class-validator para DTOs
- Sanitización de datos de entrada
- Validación de tipos y formatos

## Criterios de Aceptación Cumplidos

### ✅ Login Local Email/Password

- [x] POST /auth/register con hash bcrypt (salt rounds: 12)
- [x] POST /auth/login con validación de credenciales
- [x] Rate limit: max 5 intentos de login por IP cada 15 min
- [x] Decorator @roles(...roles: UserRole[])
- [x] RolesGuard que verifica el rol del JWT
- [x] Proteger endpoints con JwtAuthGuard + RolesGuard
- [x] GET /users/me y PATCH /users/me para perfil propio
- [x] USER no puede acceder a endpoints de ADMIN_VENUE (403)
- [x] STAFF_SCANNER no puede hacer checkout (403)

### ✅ OAuth Google con Passport.js

- [x] Instalar @nestjs/passport, passport-google-oauth20, @nestjs/jwt
- [x] Configurar GoogleStrategy con PKCE (OAuth 2.1)
- [x] Generar par de claves RS256 (ver scripts/generate-jwt-keys.js)
- [x] Emitir access token (15 min) + refresh token en HttpOnly cookie (7 días)
- [x] Implementar rotación de refresh token
- [x] Endpoints: GET /auth/google, GET /auth/google/callback, POST /auth/refresh, POST /auth/logout
- [x] JwtAuthGuard global con excepción en rutas públicas
- [x] Cookie: HttpOnly + SameSite=Strict + Secure
- [x] Token NUNCA en localStorage

## Pruebas de Funcionalidad

### 1. Registro de Usuario

```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "usuario@example.com",
    "name": "Juan Pérez",
    "password": "Password123!",
    "role": "USER"
  }'
```

### 2. Login

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "usuario@example.com",
    "password": "Password123!"
  }'
```

### 3. Acceso a Endpoint Protegido

```bash
curl -X GET http://localhost:3000/users/me \
  -H "Authorization: Bearer <access-token>"
```

### 4. Verificación RBAC

- USER intentando acceder a `/users/admin-only` → 403 Forbidden
- STAFF_SCANNER accediendo a `/users/staff-only` → 200 OK
- ADMIN_VENUE accediendo a cualquier endpoint → Permitido según roles

## Migraciones de Base de Datos

El esquema Prisma ya incluye los campos necesarios:

- `UserRole` enum (USER, STAFF_SCANNER, ADMIN_VENUE)
- `AuthProvider` enum (LOCAL, GOOGLE, APPLE)
- Campos: `passwordHash`, `provider`, `role`, `isActive`

## Configuración para Desarrollo

1. Copiar variables de entorno:

```bash
cp apps/api/.env.example.auth apps/api/.env.local
```

2. Instalar dependencias:

```bash
cd apps/api && npm install
```

3. Ejecutar migraciones:

```bash
npx prisma migrate dev
```

4. Iniciar servidor:

```bash
npm run dev
```

## Notas de Implementación

### Decisiones de Diseño

1. **Separación de responsabilidades**: AuthService maneja lógica, controllers manejan HTTP
2. **Modularidad**: Todo el código de auth en un módulo independiente
3. **Seguridad por defecto**: Todas las rutas protegidas excepto las explícitamente públicas
4. **Escalabilidad**: Preparado para agregar más providers (Apple, Facebook, etc.)

### Consideraciones de Producción

1. **Rotación de claves**: Implementar sistema de rotación de claves JWT
2. **Logging**: Agregar logging detallado de intentos de autenticación
3. **Monitoring**: Monitorear tasa de fallos de autenticación
4. **Backup**: Backup regular de claves RSA

### Mejoras Futuras

1. Implementar 2FA (Two-Factor Authentication)
2. Agregar soporte para Apple Sign-In
3. Implementar sistema de recuperación de contraseña
4. Agregar auditoría de logins
5. Implementar blacklist de tokens
