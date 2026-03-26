# Guía de Resolución de Warnings del Linter

## Introducción

Esta guía proporciona recomendaciones específicas para resolver los 80 warnings identificados en el análisis del linter del proyecto API Nightpass. Cada sección aborda un tipo de warning con ejemplos prácticos y soluciones.

## 1. Resolver `@typescript-eslint/no-explicit-any` (~42 warnings)

### Problema

Uso del tipo `any` que elimina las ventajas de TypeScript.

### Soluciones

#### a) Usar tipos específicos

```typescript
// ❌ MAL
function processData(data: any) {
  return data.value;
}

// ✅ BIEN
interface ProcessData {
  value: string;
  id: number;
}

function processData(data: ProcessData) {
  return data.value;
}
```

#### b) Usar tipos genéricos cuando sea apropiado

```typescript
// ❌ MAL
function getFirst(items: any[]): any {
  return items[0];
}

// ✅ BIEN
function getFirst<T>(items: T[]): T | undefined {
  return items[0];
}
```

#### c) Usar `unknown` con type guards

```typescript
// ❌ MAL
function parseResponse(response: any) {
  return JSON.parse(response);
}

// ✅ BIEN
function parseResponse(response: unknown) {
  if (typeof response === 'string') {
    return JSON.parse(response);
  }
  throw new Error('Invalid response type');
}
```

#### d) Crear tipos para objetos complejos

```typescript
// ❌ MAL
const config: any = {
  apiUrl: 'http://localhost:3000',
  timeout: 5000,
};

// ✅ BIEN
interface AppConfig {
  apiUrl: string;
  timeout: number;
  retries?: number;
}

const config: AppConfig = {
  apiUrl: 'http://localhost:3000',
  timeout: 5000,
};
```

### Estrategia de implementación

1. Identificar archivos con `any` usando: `grep -r "any" apps/api/src --include="*.ts"`
2. Priorizar archivos de dominio principal (services, controllers)
3. Crear interfaces en archivos de tipos compartidos cuando sea necesario

## 2. Resolver `@typescript-eslint/no-unused-vars` (~35 warnings)

### Problema

Variables, parámetros o importaciones declaradas pero no utilizadas.

### Soluciones

#### a) Eliminar variables no utilizadas

```typescript
// ❌ MAL
const unusedVariable = 'test';
const usedVariable = 'hello';

// ✅ BIEN
const usedVariable = 'hello';
```

#### b) Usar el patrón `_` para parámetros ignorados

```typescript
// ❌ MAL
app.get('/test', (req, res, next) => {
  // next no se usa
  res.send('OK');
});

// ✅ BIEN
app.get('/test', (req, res, _next) => {
  res.send('OK');
});
```

#### c) Eliminar importaciones no utilizadas

```typescript
// ❌ MAL
import { Controller, Get, Post, Put } from '@nestjs/common';

@Controller('users')
export class UsersController {
  @Get()
  findAll() {
    /* ... */
  }

  // Post y Put no se usan
}

// ✅ BIEN
import { Controller, Get } from '@nestjs/common';

@Controller('users')
export class UsersController {
  @Get()
  findAll() {
    /* ... */
  }
}
```

#### d) Revisar decoradores de class-validator

```typescript
// ❌ MAL
import { IsString, IsInt, IsBoolean } from 'class-validator';

export class CreateEventDto {
  @IsString()
  name: string;

  // IsInt e IsBoolean no se usan
}

// ✅ BIEN
import { IsString } from 'class-validator';

export class CreateEventDto {
  @IsString()
  name: string;
}
```

### Casos específicos encontrados

#### Testing modules

```typescript
// En archivos *.spec.ts
// ❌ MAL
import { Test, TestingModule } from '@nestjs/testing';

describe('AuthService', () => {
  let service: AuthService;
  let module: TestingModule; // No se usa

  beforeEach(async () => {
    module = await Test.createTestingModule({
      /* ... */
    }).compile();
    service = module.get<AuthService>(AuthService);
  });
});

// ✅ BIEN - Eliminar la variable no utilizada
import { Test } from '@nestjs/testing';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      /* ... */
    }).compile();
    service = module.get<AuthService>(AuthService);
  });
});
```

#### Servicios inyectados no utilizados

```typescript
// ❌ MAL
@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService, // No se usa en algunos métodos
  ) {}
}

// ✅ BIEN - Revisar si realmente se necesita la inyección
@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  // O usar el servicio en algún método
}
```

## 3. Resolver `no-console` (3 warnings)

### Problema

Uso de `console.log`, `console.info`, etc. en código de producción.

### Soluciones

#### a) Usar logger de NestJS

```typescript
// ❌ MAL
console.log('User authenticated:', userId);

// ✅ BIEN
import { Logger } from '@nestjs/common';

private readonly logger = new Logger(AuthService.name);

this.logger.log(`User authenticated: ${userId}`);
```

#### b) Configurar niveles de log apropiados

```typescript
// Para debugging en desarrollo
if (process.env.NODE_ENV === 'development') {
  console.debug('Debug info:', data);
}

// En producción, usar logger estructurado
this.logger.debug('Debug info:', data);
```

#### c) Remover console statements de producción

```typescript
// ❌ MAL
export class AppService {
  getHello(): string {
    console.log('Hello endpoint called');
    return 'Hello World!';
  }
}

// ✅ BIEN
export class AppService {
  private readonly logger = new Logger(AppService.name);

  getHello(): string {
    this.logger.log('Hello endpoint called');
    return 'Hello World!';
  }
}
```

## Estrategia de Corrección Paso a Paso

### Fase 1: Análisis Detallado (1-2 horas)

1. **Generar reporte por archivo:**
   ```bash
   pnpm --filter api lint --format=json > lint-report.json
   ```
2. **Identificar archivos con más warnings:**
   ```bash
   jq '.[] | select(.warningCount > 0) | {filePath: .filePath, warningCount: .warningCount}' lint-report.json | sort -k3 -nr
   ```

### Fase 2: Corrección Priorizada (4-8 horas)

1. **Corregir archivos de dominio principal:**
   - `apps/api/src/modules/auth/`
   - `apps/api/src/modules/events/`
   - `apps/api/src/modules/venues/`
2. **Enfocarse en warnings de `no-explicit-any` primero** (mayor impacto en calidad)
3. **Luego corregir `no-unused-vars`** (más mecánico)
4. **Finalmente `no-console`** (rápido de resolver)

### Fase 3: Verificación y CI (1 hora)

1. **Ejecutar lint después de correcciones:**
   ```bash
   pnpm --filter api lint
   ```
2. **Actualizar configuración de CI/CD** para fallar si hay nuevos warnings:
   ```yaml
   # En GitHub Actions
   - name: Lint
     run: pnpm --filter api lint --max-warnings=0
   ```

## Herramientas y Comandos Útiles

### Buscar todos los `any` en el código

```bash
grep -r ": any" apps/api/src --include="*.ts" | wc -l
```

### Buscar importaciones no utilizadas automáticamente

```bash
# Usar ESLint con la regla específica
pnpm --filter api lint --rule "@typescript-eslint/no-unused-vars: error"
```

### Corregir automáticamente algunos problemas

```bash
# ESLint puede auto-corregir algunos issues
pnpm --filter api lint --fix
```

### Ver warnings por archivo específico

```bash
pnpm --filter api lint apps/api/src/modules/auth/auth.service.ts
```

## Consideraciones de Configuración

### Opción A: Hacer reglas más estrictas

Modificar [`packages/config/eslint-base.js`](packages/config/eslint-base.js):

```javascript
rules: {
  '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
  '@typescript-eslint/no-explicit-any': 'error',
  'no-console': ['error', { allow: ['warn', 'error'] }],
}
```

### Opción B: Configuración gradual

```javascript
rules: {
  '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
  '@typescript-eslint/no-explicit-any': 'warn',
  'no-console': ['warn', { allow: ['warn', 'error'] }],
  // Agregar después de corregir warnings
  // '@typescript-eslint/no-explicit-any': 'error',
}
```

## Métricas de Progreso

| Métrica           | Antes | Meta | Actual |
| ----------------- | ----- | ---- | ------ |
| Total warnings    | 80    | 0    | 80     |
| `no-explicit-any` | ~42   | 0    | ~42    |
| `no-unused-vars`  | ~35   | 0    | ~35    |
| `no-console`      | 3     | 0    | 3      |

## Conclusión

Resolver estos 80 warnings mejorará significativamente:

1. **Calidad del código**: Tipado más seguro y código más limpio
2. **Mantenibilidad**: Menos código innecesario y mejor documentación implícita
3. **Prevención de bugs**: TypeScript podrá detectar más errores en tiempo de compilación
4. **Consistencia del equipo**: Código más predecible y fácil de revisar

**Tiempo estimado total:** 6-12 horas de trabajo distribuido entre el equipo.

---

**Documento de referencia** - Última actualización: 25 de marzo de 2026  
**Relacionado:** [`docs/LINT_WARNINGS_ANALYSIS.md`](docs/LINT_WARNINGS_ANALYSIS.md)
