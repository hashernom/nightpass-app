# Deuda Técnica - NightPass

Este documento registra las mejoras pendientes y deuda técnica identificada en el proyecto.

## Prioridad Alta

### 1. Limpieza de Warnings de ESLint en API

**Estado**: Pendiente  
**Ubicación**: `apps/api/`  
**Descripción**: Actualmente hay aproximadamente 80 warnings de ESLint en el backend que están siendo ignorados en el CI para permitir que el pipeline pase. Estos warnings incluyen:

- `@typescript-eslint/no-explicit-any` - Uso de tipos `any`
- `@typescript-eslint/no-unused-vars` - Variables declaradas pero no usadas
- Reglas de estilo y mejores prácticas

**Impacto**:

- Dificulta la detección de problemas reales entre el ruido
- Impide activar `--max-warnings 0` en el CI
- Reduce la calidad del código

**Acción requerida**:

1. Ejecutar `pnpm --filter api lint` para ver todos los warnings
2. Corregir warnings uno por uno o en lotes
3. Reactivar `--max-warnings 0` en `apps/api/package.json`

**Estimación**: 2-3 días de trabajo

## Prioridad Media

### 2. Configuración ESLint unificada

**Estado**: Pendiente  
**Descripción**: El frontend (`apps/web`) usa una configuración ESLint básica mientras que el backend tiene una configuración diferente. Sería ideal tener una configuración compartida en `packages/config/`.

**Acción requerida**:

1. Crear configuración ESLint compartida en `packages/config/eslint-config/`
2. Actualizar ambas apps para usar la configuración compartida
3. Asegurar compatibilidad con Next.js y NestJS

### 3. Mejora de scripts de lint

**Estado**: Completado parcialmente  
**Descripción**: Se corrigió el script de lint del frontend para usar ESLint nativo en lugar de `next lint` (que no funciona en Next.js 16.2.1 en monorepos).

**Cambios realizados**:

- `apps/web/package.json`: Cambiado de `"next lint --dir src"` a `"eslint \"src/**/*.{ts,tsx}\" --max-warnings 0"`
- `apps/api/package.json`: Eliminado `--max-warnings 0` para permitir warnings temporalmente

## Prioridad Baja

### 4. Documentación de comandos de auditoría

**Estado**: Completado  
**Descripción**: Actualizar documentación para reflejar el comando correcto de auditoría de seguridad.

**Cambios realizados**:

- CI workflow: Cambiado de `pnpm --filter api exec npm audit --audit-level=critical` a `pnpm audit --audit-level=critical`
- README.md actualizado con el comando correcto

### 5. Generación de tipos Prisma en documentación

**Estado**: Completado  
**Descripción**: Agregar paso crítico de generación de tipos Prisma en la documentación de onboarding.

**Cambios realizados**:

- README.md: Agregado paso `pnpm --filter @nightpass/api run prisma:generate`
- ONBOARDING.txt: Agregado paso explícito con advertencia sobre errores de TypeScript

## Registro de Cambios

### 2026-03-25 - Reparaciones del Pipeline CI

- **Corregido**: Scripts de lint en frontend y backend
- **Corregido**: Configuración ESLint para frontend
- **Corregido**: Comando de auditoría en workflow CI
- **Agregado**: Paso de generación de tipos Prisma en CI
- **Documentado**: Deuda técnica de 80 warnings de ESLint
- **Actualizado**: README.md y ONBOARDING.txt con pasos críticos

## Próximos Pasos

1. **Sprint de limpieza de código**: Asignar tiempo para corregir los 80 warnings de ESLint
2. **Reactivar strict mode**: Una vez corregidos los warnings, reactivar `--max-warnings 0` en API
3. **Configuración unificada**: Crear configuración ESLint compartida para todo el monorepo
4. **Automatización**: Agregar pre-commit hooks para prevenir nuevos warnings

## Métricas de Calidad

- **Coverage actual**: >80% (ver `pnpm test:cov`)
- **Warnings ESLint**: ~80 en API, 0 en Web (con `--max-warnings 0`)
- **TypeScript errors**: 0 (después de `prisma:generate`)
- **Security audit**: Pasa con `pnpm audit --audit-level=critical`

---

_Este documento se actualiza automáticamente con cada revisión de código y sprint de limpieza._
