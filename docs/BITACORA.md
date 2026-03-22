# NightPass — Bitácora del Proyecto
> Registro cronológico de todo lo construido, decisiones tomadas y estado actual.
> Repositorio: https://github.com/hashernom/nightpass-app
> Última actualización: Marzo 2026

---

## Estado general del MVP

| Épica | Descripción | Estado |
|-------|-------------|--------|
| E1 | Fundación e Infraestructura | 🟡 Parcial (ver detalle) |
| E2 | Auth Social y Roles | ⏳ Pendiente |
| E3 | Marketplace de Eventos | ⏳ Pendiente |
| E4 | Compra de Cover y Pagos | ⏳ Pendiente |
| E5 | Fast Pass QR | ⏳ Pendiente |
| E6 | Validador de Puerta Staff | ⏳ Pendiente |
| E7 | Panel B2B Admin Venue | ⏳ Pendiente |
| E8 | Notificaciones Transaccionales | ⏳ Pendiente |
| E9 | Seguridad y Compliance | ⏳ Pendiente |

---

## Fase de Documentación (pre-código)

### Ficha Técnica v2.0
Se elaboró la ficha técnica completa del proyecto cubriendo:
- Arquitectura general (monolito modular escalable a microservicios)
- Stack tecnológico completo con versiones y justificaciones
- Modelo de seguridad por capas (Defense in Depth)
- Infraestructura y proveedores con costos
- Metodología Kanban y backlog de 9 épicas

### Documentación UML (Figma)
Se generaron 9 diagramas en Figma, exportados también en `docs/UML_NIGHTPASS.md`:

| # | Diagrama | Tipo |
|---|----------|------|
| 1 | Arquitectura General | Flowchart |
| 2 | Flujo Compra de Cover y Pagos | Sequence |
| 3 | Flujo Validación QR en Puerta | Sequence |
| 4 | Estados del Ticket y QR Fast Pass | State Diagram |
| 5 | Pipeline CI/CD | Flowchart |
| 6 | Gantt Épicas MVP | Gantt |
| 7 | ERD — Esquema de Base de Datos | ER Diagram |
| 8 | Matriz de Permisos por Rol | Tabla |
| 9 | Estructura de Módulos del Monorepo | Flowchart |

### Documento Técnico Completo (.docx)
Se generó `NightPass_Documentacion_Tecnica.docx` con:
- 30 endpoints REST documentados (método, path, body, respuesta, roles)
- 30 variables de entorno con ejemplos y comandos de generación
- 18 reglas de negocio detalladas
- Códigos de error HTTP estándar
- Guía de setup local paso a paso

### Análisis de completitud
Se realizó un análisis del 72% de completitud del proyecto detectando:
- Completo: arquitectura, stack, seguridad, épicas, flujos UML
- Faltante: wireframes UI, schema Prisma real, DTOs concretos, templates de email, legal

---

## Creación del Repositorio

**Repositorio:** https://github.com/hashernom/nightpass-app (privado)

### Lo que se configuró en GitHub

**16 Labels creadas:**
- 9 labels de épicas con colores (E1 a E9)
- 3 niveles de prioridad (alta, media, baja)
- backend, frontend, infra, bloqueado

**19 Issues creados** — uno por tarea principal, con:
- Checklist de subtareas detallado
- Criterio de aceptación claro
- Referencias a reglas de negocio del documento técnico
- Labels asignadas por épica, área y prioridad

### Archivos del commit inicial
- `README.md` — documentación de entrada
- `package.json` — configuración del monorepo
- `turbo.json` — coordinación de builds con Turborepo
- `.gitignore` — exclusión de node_modules, .env, dist
- `apps/api/.env.example` — plantilla de 30 variables del backend
- `apps/web/.env.example` — plantilla de 6 variables del frontend
- `apps/api/prisma/schema.prisma` — schema completo con 9 tablas
- `.github/workflows/ci.yml` — pipeline CI/CD base
- `docs/UML_NIGHTPASS.md` — documentación UML completa en markdown
- `ESTRUCTURA_EXPLICADA.txt` — guía de qué hace cada archivo

---

## E1 — Fundación e Infraestructura

### Issue 1: Setup monorepo Turborepo ✅ DONE

**Commits:**
- `feat(e1): setup completo del monorepo` — 36 archivos
- `feat(e1): migraciones prisma aplicadas` — 4 archivos

**Lo que se implementó:**

`packages/config/`
- `eslint-base.js` — reglas de ESLint compartidas entre todas las apps
- `tsconfig.base.json` — configuración TypeScript base con strict mode

`packages/types/`
- `src/index.ts` — todos los enums del sistema (UserRole, EventStatus, TicketStatus, PaymentStatus, PaymentGateway, ScanResult) y DTOs compartidos (UserDto, VenueDto, EventDto, TicketDto, PaymentDto, ApiResponse, PaginatedResponse)

`packages/zod-schemas/`
- `src/index.ts` — schemas de validación compartidos: RegisterSchema, LoginSchema, CreateVenueSchema, CreateEventSchema, CheckoutSchema, ValidateQrSchema, PaginationSchema

`apps/api/` — NestJS 10 base
- `package.json` — 35 dependencias de producción y desarrollo
- `tsconfig.json` — configuración TypeScript para NestJS
- `nest-cli.json` — configuración del CLI de NestJS
- `src/main.ts` — entrada del servidor con Helmet, CORS, ValidationPipe global, Swagger (solo dev), prefijo `/api/v1`
- `src/app.module.ts` — módulo raíz con ConfigModule global y ThrottlerModule (100 req/min)
- `src/app.controller.ts` — endpoint `GET /health` que confirma que el servidor está vivo
- `src/shared/prisma/prisma.service.ts` — cliente Prisma con onModuleInit/onModuleDestroy
- `src/shared/prisma/prisma.module.ts` — módulo global de Prisma disponible en toda la app
- `src/shared/filters/http-exception.filter.ts` — manejo global de errores con formato JSON uniforme
- `src/shared/decorators/roles.decorator.ts` — decorator `@Roles(...roles)` para proteger endpoints
- `src/shared/decorators/current-user.decorator.ts` — decorator `@CurrentUser()` para extraer usuario del JWT
- `prisma/schema.prisma` — schema completo con 10 tablas, 9 enums, relaciones y constraints
- `prisma/migrations/` — historial de migraciones versionado

`apps/web/` — Next.js 14 base
- `package.json` — 25 dependencias incluyendo React Query, Zustand, Zod, Stripe, Supabase JS
- `tsconfig.json` — configuración TypeScript para Next.js con path aliases
- `next.config.js` — transpilePackages para monorepo, remotePatterns para imágenes
- `tailwind.config.js` — CSS variables para sistema de diseño (colores, radio, fuentes)
- `postcss.config.js` — Tailwind + Autoprefixer
- `src/app/layout.tsx` — layout raíz con fuente Inter y metadata del sitio
- `src/app/providers.tsx` — QueryClientProvider con configuración de React Query
- `src/app/globals.css` — variables CSS del sistema de diseño (light + dark mode)
- `src/app/page.tsx` — página de inicio mínima funcional
- `src/lib/api.ts` — instancia de Axios con interceptors JWT (attach token + refresh automático)
- `src/lib/stores/auth.store.ts` — Zustand store para estado de autenticación global

Raíz del monorepo
- `pnpm-workspace.yaml` — declaración de workspaces para pnpm
- `.prettierrc` — formato de código uniforme (singleQuote, 80 chars, LF)
- `.eslintrc.json` — ESLint raíz extendiendo config compartida
- `package.json` actualizado — scripts globales + Husky + lint-staged configurados
- `.husky/pre-commit` — hook que corre lint-staged antes de cada commit
- `pnpm install` completado — 864 paquetes instalados

**Estado:** ✅ Marcar como Done en el tablero Kanban

---

### Issue 2: Configurar Vercel + Railway + Supabase + Upstash 🟡 PARCIAL

**Lo completado:**
- Proyecto Supabase `nightpass` creado en región `sa-east-1` (São Paulo)
- ID del proyecto: `szzeondbvvsferzdqsrb`
- URL: `https://szzeondbvvsferzdqsrb.supabase.co`
- 10 tablas creadas con todos los campos, tipos, relaciones e índices
- Migración registrada en `_prisma_migrations`
- Variables de entorno configuradas en `.env.local` (no está en el repo)

**Pendiente para antes del primer deploy:**
- Conectar Vercel al repo (deploy automático del frontend)
- Configurar Railway para el backend NestJS
- Crear base de datos Redis en Upstash (necesario para E5 — QR locks)

**Nota sobre la conexión local vs Supabase:**
El plan gratuito de Supabase bloquea conexiones TCP directas desde IPs externas al puerto 5432. Esto es normal y esperado. La solución adoptada es trabajar 100% en local durante el desarrollo y sincronizar con Supabase antes de cada deploy vía MCP de Supabase o Supabase CLI.

**Base de datos de desarrollo local:**
- Motor: PostgreSQL 18 (instalado como servicio en Windows)
- Base de datos: `nightpass_dev`
- Host: `localhost:5432`
- Migraciones aplicadas: 2 (`init_nightpass_schema` + `init`)
- Estado: `Database schema is up to date`

**Estado:** ⏳ Dejar en Backlog — retomar antes del primer deploy

---

### Issue 3: Pipeline CI/CD con GitHub Actions + Husky 🟡 PARCIAL

**Lo completado:**
- Archivo `.github/workflows/ci.yml` en el repo con todos los pasos
- Husky instalado y configurado con pre-commit hook
- lint-staged configurado en `package.json` raíz

**Pendiente:**
- El pipeline de CI aún no pasa exitosamente porque los scripts de `lint`, `test` y `build` de las apps necesitan código real para ejecutarse. Se va completando solo conforme avancen las épicas.
- Verificar que el pipeline pasa en verde antes del primer deploy

**Estado:** ⏳ Dejar en Backlog — se completa solo conforme avanza el proyecto

---

## Decisiones técnicas tomadas en E1

| Decisión | Justificación |
|----------|---------------|
| PostgreSQL local para desarrollo | Plan free de Supabase bloquea conexiones directas desde IPs externas |
| pnpm como package manager | Mejor manejo de workspaces en monorepo, más rápido que npm |
| `--no-verify` en el primer commit grande | Husky recién configurado, sin scripts de lint funcionales aún |
| Supabase en sa-east-1 (São Paulo) | Región más cercana a Colombia, menor latencia |
| Node 25 detectado (no 20 LTS) | Se usa la versión instalada. Para producción en Railway usar Node 20 LTS |

---

## Ambiente de desarrollo configurado

```
Desarrollo local
├── PostgreSQL 18 en localhost:5432
│   └── nightpass_dev (10 tablas migradas)
├── apps/api en localhost:3001
│   └── GET /health → { status: "ok" }
└── apps/web en localhost:3000
    └── Página de inicio funcionando

Producción (configurado, pendiente deploy)
├── Supabase — PostgreSQL (sa-east-1)
│   └── 10 tablas + 9 enums + 10 índices
├── Vercel — Frontend (pendiente conectar)
├── Railway — Backend (pendiente configurar)
└── Upstash — Redis (pendiente crear)
```

---

## Archivos en el repositorio (46 en total)

```
nightpass-app/
├── .eslintrc.json
├── .github/workflows/ci.yml
├── .gitignore
├── .husky/pre-commit
├── .prettierrc
├── ESTRUCTURA_EXPLICADA.txt
├── README.md
├── docs/UML_NIGHTPASS.md
├── package.json
├── pnpm-lock.yaml
├── pnpm-workspace.yaml
├── turbo.json
├── apps/
│   ├── api/
│   │   ├── .env.example
│   │   ├── nest-cli.json
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   ├── prisma/
│   │   │   ├── schema.prisma
│   │   │   ├── migration_lock.toml
│   │   │   └── migrations/
│   │   │       ├── 20260322215600_init_nightpass_schema/migration.sql
│   │   │       └── 20260322221946_init/migration.sql
│   │   └── src/
│   │       ├── app.controller.ts
│   │       ├── app.module.ts
│   │       ├── main.ts
│   │       └── shared/
│   │           ├── decorators/current-user.decorator.ts
│   │           ├── decorators/roles.decorator.ts
│   │           ├── filters/http-exception.filter.ts
│   │           └── prisma/prisma.module.ts + prisma.service.ts
│   └── web/
│       ├── .env.example
│       ├── next.config.js
│       ├── package.json
│       ├── postcss.config.js
│       ├── tailwind.config.js
│       ├── tsconfig.json
│       └── src/
│           ├── app/globals.css + layout.tsx + page.tsx + providers.tsx
│           └── lib/api.ts + stores/auth.store.ts
└── packages/
    ├── config/eslint-base.js + package.json + tsconfig.base.json
    ├── types/package.json + src/index.ts
    └── zod-schemas/package.json + src/index.ts
```

---

## Próximo paso — E2: Auth Social y Roles

**Issues a trabajar:**
1. `[E2] OAuth Google con Passport.js y JWT RS256`
2. `[E2] Login local email/password y RBAC de 3 roles`

**Lo que se va a implementar:**
- `apps/api/src/modules/auth/` — módulo completo de autenticación
- `POST /auth/register` — registro con bcrypt
- `POST /auth/login` — login con email/password
- `GET /auth/google` + `GET /auth/google/callback` — OAuth Google con PKCE
- `POST /auth/refresh` — rotación de refresh token en HttpOnly cookie
- `POST /auth/logout` — invalidar refresh token
- JWT RS256 con access token de 15 min y refresh token de 7 días
- `JwtAuthGuard` — guard global para proteger endpoints
- `RolesGuard` — guard para verificar rol del usuario
- Rate limit en endpoints de auth (5 intentos / 15 min por IP)
- `apps/api/src/modules/users/` — módulo de usuarios (GET /users/me, PATCH /users/me)

**Prerequisito antes de empezar E2:**
Generar el par de claves RS256 y agregarlas al `.env.local`:
```powershell
cd D:\Nightpass-sc\apps\api
ssh-keygen -t rsa -b 4096 -m PEM -f jwtRS256.key
# Copia el contenido de jwtRS256.key → JWT_PRIVATE_KEY
# Copia el contenido de jwtRS256.key.pub → JWT_PUBLIC_KEY
```

---

## Épicas pendientes (en orden de desarrollo)

| Épica | Prerequisito | Cuándo arrancar |
|-------|-------------|-----------------|
| E2 Auth | E1 completo | Ahora |
| E9 Seguridad base | E2 | Con E2 (van juntas) |
| E3 Marketplace | E2 | Después de E2 |
| E4 Pagos | E3 | Después de E3 |
| E5 QR | E4 | Después de E4 |
| E6 Scanner | E5 | Después de E5 |
| E8 Notificaciones | E4 + E5 | Junto con E5/E6 |
| E7 Panel B2B | E6 | Al final |
| Deploy infra | Todas | Antes del primer demo |

---

*NightPass — Bitácora v1.0 — Marzo 2026*
