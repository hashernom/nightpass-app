# NightPass 🎟️

> Plataforma de ticketing para vida nocturna — MVP Web App

## Stack

| Capa | Tecnología |
|------|-----------|
| Frontend | Next.js 14 + TypeScript + Tailwind + shadcn/ui |
| Backend | NestJS 10 + Prisma ORM + Passport.js |
| Base de datos | PostgreSQL 16 (Supabase) + Redis 7 (Upstash) |
| Pagos | Stripe + Wompi |
| Infra | Vercel + Railway + Cloudflare |

## Estructura del monorepo

```
nightpass/
├── apps/
│   ├── web/          # Next.js 14 — Frontend
│   └── api/          # NestJS 10 — Backend REST
├── packages/
│   ├── types/        # DTOs y tipos compartidos
│   ├── zod-schemas/  # Validaciones compartidas
│   └── config/       # ESLint + TS config base
└── .github/
    └── workflows/    # CI/CD pipelines
```

## Setup local

```bash
# Prerrequisitos: Node 20 LTS, pnpm 9+, Docker Desktop

git clone https://github.com/hashernom/nightpass.git
cd nightpass
pnpm install

cp apps/api/.env.example apps/api/.env.local
cp apps/web/.env.example apps/web/.env.local
# → Completar variables de entorno

# Base de datos local
docker run -d --name nightpass-db -e POSTGRES_PASSWORD=secret -p 5432:5432 postgres:16
docker run -d --name nightpass-redis -p 6379:6379 redis:7

pnpm --filter api prisma migrate dev
pnpm dev
```

## Documentación

- `docs/` — Ficha técnica, ERD, especificación de API
- [Tablero Kanban](../../projects) — Issues y épicas del MVP

## Roles del sistema

| Rol | Descripción |
|-----|-------------|
| `USER` | Comprador de covers y tickets |
| `STAFF_SCANNER` | Validador de QR en puerta |
| `ADMIN_VENUE` | Administrador del establecimiento |
