# NightPass

> Plataforma de ticketing para vida nocturna — MVP Web App

![NightPass Architecture](https://img.shields.io/badge/Architecture-Monorepo-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6)
![NestJS](https://img.shields.io/badge/NestJS-10.x-E0234E)
![Next.js](https://img.shields.io/badge/Next.js-14.x-000000)
![License](https://img.shields.io/badge/License-MIT-green)

NightPass es una plataforma completa de ticketing para la vida nocturna que permite a los usuarios descubrir eventos, comprar tickets, y a los establecimientos gestionar sus eventos, aforo y validación de acceso mediante QR firmados.

## Características Principales

### Para Usuarios Finales

- **Marketplace de eventos** - Descubre eventos nocturnos por ciudad, género musical y fecha
- **Checkout optimizado** - Compra rápida de covers con múltiples métodos de pago
- **QR Fast Pass** - Acceso rápido con QR firmado HMAC-SHA256
- **Dashboard personal** - Historial de tickets y eventos próximos

### Para Establecimientos (B2B)

- **Panel administrativo** - Gestión completa de venues y eventos
- **Dashboard en tiempo real** - Monitoreo de ventas y aforo
- **Gestión de staff** - Asignación de validadores de QR
- **Reportes financieros** - Análisis de ingresos y conversión

### Para Staff en Puerta

- **Interfaz scanner** - Validación instantánea de QR en móviles
- **Alertas en tiempo real** - Detección de QR duplicados o expirados
- **Logs de auditoría** - Registro completo de cada escaneo

## Stack Tecnológico

| Capa                | Tecnología                                     | Propósito                                |
| ------------------- | ---------------------------------------------- | ---------------------------------------- |
| **Frontend**        | Next.js 14 + TypeScript + Tailwind + shadcn/ui | Aplicación web SSR/SSG con UI accesible  |
| **Backend**         | NestJS 10 + Prisma ORM + Passport.js           | API REST modular con autenticación JWT   |
| **Base de datos**   | PostgreSQL 16 (Supabase) + Redis 7 (Upstash)   | Datos transaccionales + cache y locks    |
| **Pagos**           | Stripe + Wompi                                 | Procesamiento internacional y local      |
| **Infraestructura** | Vercel + Railway + Cloudflare                  | Hosting global con CDN y DDoS protection |
| **Email**           | Resend + BullMQ                                | Notificaciones transaccionales async     |
| **Monitoreo**       | Sentry + PostHog                               | Errores en producción + analítica        |

## Estructura del Monorepo

```
nightpass/
├── apps/
│   ├── web/                    # Next.js 14 — Frontend
│   │   ├── app/                # App Router (Next.js 14)
│   │   │   ├── (auth)/         # Login, registro
│   │   │   ├── (marketplace)/  # Listado y detalle de eventos
│   │   │   ├── (checkout)/     # Flujo de compra
│   │   │   ├── (dashboard)/    # Mis tickets y QR
│   │   │   ├── (scanner)/      # Interfaz de validación
│   │   │   └── (admin)/        # Panel B2B
│   │   ├── components/         # Componentes React reutilizables
│   │   └── lib/                # Utilidades, hooks, stores
│   │
│   └── api/                    # NestJS 10 — Backend REST
│       ├── src/modules/        # Módulos por dominio
│       │   ├── auth/           # Autenticación JWT + OAuth
│       │   ├── users/          # Gestión de perfiles
│       │   ├── venues/         # CRUD de establecimientos
│       │   ├── events/         # Eventos y programación
│       │   ├── tickets/        # Compra y validación
│       │   ├── payments/       # Stripe, Wompi, webhooks
│       │   ├── scanner/        # Validación de QR
│       │   ├── notifications/  # Emails async
│       │   └── admin/          # Panel B2B
│       └── src/shared/         # Código compartido
│           ├── guards/         # JwtAuthGuard, RolesGuard
│           ├── decorators/     # @CurrentUser(), @Roles()
│           ├── filters/        # Manejo global de errores
│           └── prisma/         # Servicio de base de datos
│
├── packages/                   # Código compartido entre apps
│   ├── types/                  # DTOs y tipos TypeScript
│   ├── zod-schemas/           # Validaciones compartidas
│   └── config/                # ESLint + TS config base
│
├── docs/                      # Documentación técnica
│   ├── UML_NIGHTPASS.md       # Diagramas de arquitectura
│   └── USER_GUIDE.md          # Guía de usuario (este archivo)
│
└── .github/workflows/         # Pipelines CI/CD
```

## Setup Local

### Prerrequisitos

- **Node.js 20+** - [Descargar](https://nodejs.org)
- **pnpm 9+** - `npm install -g pnpm`
- **PostgreSQL 16+** o **Docker Desktop** (opcional)
- **Redis 7+** o **Docker Desktop** (opcional)
- **Git** - Control de versiones

### Opción 1: Usando Docker (Recomendado para desarrollo rápido)

#### 1. Clonar el repositorio

```bash
git clone https://github.com/hashernom/nightpass.git
cd nightpass
```

#### 2. Instalar dependencias

```bash
pnpm install
```

#### 3. Configurar variables de entorno

```bash
# Copiar plantillas
cp apps/api/.env.example apps/api/.env.local
cp apps/web/.env.example apps/web/.env.local

# Editar apps/api/.env.local con tus credenciales
# DATABASE_URL=postgresql://postgres:secret@localhost:5432/nightpass_dev
# JWT_SECRET=tu_secreto_jwt_muy_seguro
```

#### 4. Levantar bases de datos con Docker

```bash
# PostgreSQL para datos transaccionales
docker run -d --name nightpass-db \
  -e POSTGRES_PASSWORD=secret \
  -p 5432:5432 \
  postgres:16

# Redis para cache y locks de QR
docker run -d --name nightpass-redis \
  -p 6379:6379 \
  redis:7
```

#### 5. Copiar .env.local a .env (requerido por NestJS)

```bash
cd apps/api
cp .env.local .env
cd ../..
```

#### 6. Ejecutar migraciones de Prisma

```bash
pnpm --filter api prisma migrate dev
```

#### 7. Generar tipos TypeScript de Prisma (CRÍTICO)

```bash
pnpm --filter @nightpass/api run prisma:generate
```

**Nota**: Este paso es obligatorio antes de ejecutar `pnpm type-check` o `pnpm lint`. Sin él, TypeScript mostrará errores como "Module '@prisma/client' has no exported member 'User'".

#### 8. Iniciar la aplicación

```bash
pnpm dev
```

### Opción 2: Instalación nativa (Sin Docker)

Sigue las instrucciones detalladas en [ONBOARDING.txt](ONBOARDING.txt) para:

1. Instalar PostgreSQL 18 y pgAdmin
2. Crear la base de datos `nightpass_dev` manualmente
3. Instalar Redis 7
4. Configurar las variables de entorno con tus credenciales reales

La aplicación estará disponible en:

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **Swagger UI**: http://localhost:3001/api/docs
- **Prisma Studio**: http://localhost:5555 (ejecutar `pnpm --filter api prisma studio`)

## Roles del Sistema

| Rol               | Descripción                       | Permisos Clave                                                                             |
| ----------------- | --------------------------------- | ------------------------------------------------------------------------------------------ |
| **USER**          | Comprador de covers y tickets     | - Ver eventos<br>- Comprar tickets<br>- Ver QR personal<br>- Ver historial                 |
| **STAFF_SCANNER** | Validador de QR en puerta         | - Escanear QR<br>- Ver logs de su evento<br>- Marcar entradas                              |
| **ADMIN_VENUE**   | Administrador del establecimiento | - Crear/editar eventos<br>- Gestionar staff<br>- Ver dashboard ventas<br>- Controlar aforo |

## Guías de Usuario

### Flujo de Compra de Tickets

1. **Explorar eventos** - Navega por el marketplace filtrando por ciudad, género o fecha
2. **Seleccionar evento** - Ve detalles, horarios, precios y disponibilidad
3. **Proceder al checkout** - Selecciona cantidad de tickets y aplica promociones
4. **Pago seguro** - Usa tarjeta (Stripe) o PSE/Nequi (Wompi)
5. **Recibir QR** - Recibe email con QR y accede a tu dashboard para verlo
6. **Presentar en puerta** - Muestra el QR al staff para validación

### Flujo de Validación QR (Staff)

1. **Iniciar sesión** - Accede a la interfaz scanner con credenciales STAFF_SCANNER
2. **Escanear código** - Usa la cámara del móvil o introduce manualmente
3. **Ver resultado** - Pantalla verde (acceso permitido) o roja (denegado)
4. **Registro automático** - Cada escaneo se guarda en logs de auditoría

### Panel Administrativo (Admin Venue)

1. **Dashboard principal** - Vista general de ventas, aforo y conversión
2. **Gestión de eventos** - Crear, publicar y editar eventos
3. **Control de palcos** - Configurar mesas VIP y precios
4. **Gestión de staff** - Asignar validadores a eventos específicos
5. **Reportes** - Exportar datos de ventas y asistencia

## API Documentation

La API REST sigue el estándar OpenAPI 3.0 y está disponible en:

- **Swagger UI**: http://localhost:3001/api/docs (en desarrollo)
- **OpenAPI Spec**: http://localhost:3001/api/docs-json

### Autenticación

```bash
# 1. Obtener token JWT
curl -X POST http://localhost:3001/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"usuario@ejemplo.com","password":"contraseña"}'

# 2. Usar token en requests
curl -X GET http://localhost:3001/api/v1/users/me \
  -H "Authorization: Bearer <tu_token_jwt>"
```

### Endpoints Principales

| Método | Endpoint            | Descripción      | Rol Requerido |
| ------ | ------------------- | ---------------- | ------------- |
| `POST` | `/auth/login`       | Iniciar sesión   | Público       |
| `GET`  | `/events`           | Listar eventos   | Público       |
| `POST` | `/tickets/checkout` | Comprar ticket   | USER          |
| `POST` | `/tickets/validate` | Validar QR       | STAFF_SCANNER |
| `GET`  | `/admin/dashboard`  | Dashboard ventas | ADMIN_VENUE   |

## Testing

```bash
# Ejecutar tests unitarios
pnpm test

# Ejecutar tests E2E
pnpm test:e2e

# Ver cobertura de código
pnpm test:cov
```

## Deployment

### Entornos

- **Development**: Automático en cada PR a `develop`
- **Staging**: Automático en merge a `staging`
- **Production**: Manual desde `main` con confirmación

### Pipeline CI/CD

1. **Lint** - ESLint (web usa ESLint nativo, API permite warnings)
2. **Type checking** - TypeScript compilation (requiere `prisma:generate` previo)
3. **Tests** - Unitarios y E2E
4. **Build** - Next.js y NestJS
5. **Security audit** - `pnpm audit --audit-level=critical`
6. **Deploy** - Vercel (frontend) + Railway (backend)

## Documentación Adicional

- **[ESTRUCTURA_EXPLICADA.txt](ESTRUCTURA_EXPLICADA.txt)** - Explicación detallada de cada archivo
- **[ONBOARDING.txt](ONBOARDING.txt)** - Guía completa para nuevos colaboradores
- **[docs/UML_NIGHTPASS.md](docs/UML_NIGHTPASS.md)** - Diagramas de arquitectura completa
- **[docs/API_ENDPOINTS.md](docs/API_ENDPOINTS.md)** - Especificación completa de endpoints API
- **[docs/USER_GUIDE.md](docs/USER_GUIDE.md)** - Guía de usuario detallada
- **Tablero Kanban** - Issues y épicas del MVP (acceso interno)

## Troubleshooting Común

### "Error de conexión a PostgreSQL"

```bash
# Verificar que Docker esté corriendo (si usas Docker)
docker ps

# Verificar credenciales en .env.local
# DATABASE_URL=postgresql://postgres:secret@localhost:5432/nightpass_dev

# Verificar que la base de datos exista (instalación nativa)
psql -h localhost -U postgres -c "CREATE DATABASE nightpass_dev;"
```

### "pnpm install falla"

```bash
# Limpiar cache e instalar de nuevo
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

### "Swagger no se muestra"

```bash
# Verificar que NODE_ENV no sea 'production'
echo $NODE_ENV
# Debe estar vacío o 'development'
```

### "Prisma migrate dev falla"

```bash
# Verificar que el archivo .env exista en apps/api/
cd apps/api
ls -la .env

# Si no existe, copiar de .env.local
cp .env.local .env
cd ../..

# Luego ejecutar migraciones
pnpm --filter api prisma migrate dev
```

## Contribuir

1. **Fork** el repositorio
2. **Crea una rama** (`git checkout -b feature/nueva-funcionalidad`)
3. **Commit cambios** (`git commit -m 'feat: añadir nueva funcionalidad'`)
4. **Push a la rama** (`git push origin feature/nueva-funcionalidad`)
5. **Abre un Pull Request**

### Convenciones de Commits

- `feat:` Nueva funcionalidad
- `fix:` Corrección de bug
- `docs:` Documentación
- `style:` Formato (sin cambios funcionales)
- `refactor:` Refactorización de código
- `test:` Tests
- `chore:` Tareas de mantenimiento

## Licencia

Este proyecto está bajo la licencia MIT. Ver [LICENSE](LICENSE) para más detalles.

---

**NightPass** · Plataforma de ticketing para vida nocturna · MVP 2026
