# Pruebas de Autenticación - NightPass

## Configuración Inicial

### 1. Configurar variables de entorno

```bash
# Copiar archivo de ejemplo
cp apps/api/.env.local.example apps/api/.env.local

# Editar con tus valores
# Al menos configurar:
# - DATABASE_URL
# - JWT_SECRET
```

### 2. Ejecutar migraciones de base de datos

```bash
cd apps/api
npx prisma migrate dev
```

### 3. Iniciar servidor

```bash
npm run dev
```

## Pruebas de Endpoints

### 1. Registro de Usuario

```bash
curl -X POST http://localhost:3001/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "name": "Usuario Test",
    "password": "Password123!",
    "role": "USER"
  }'
```

**Respuesta esperada:**

```json
{
  "accessToken": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": 900,
  "tokenType": "Bearer",
  "user": {
    "id": "uuid",
    "email": "test@example.com",
    "name": "Usuario Test",
    "role": "USER"
  }
}
```

### 2. Login

```bash
curl -X POST http://localhost:3001/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Password123!"
  }'
```

### 3. Obtener perfil de usuario

```bash
curl -X GET http://localhost:3001/api/v1/users/me \
  -H "Authorization: Bearer <access-token>"
```

### 4. Actualizar perfil

```bash
curl -X PATCH http://localhost:3001/api/v1/users/me \
  -H "Authorization: Bearer <access-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Nuevo Nombre"
  }'
```

### 5. Probar RBAC (Control de Acceso Basado en Roles)

#### Usuario USER intentando acceder a endpoint de ADMIN

```bash
curl -X GET http://localhost:3001/api/v1/users/admin-only \
  -H "Authorization: Bearer <user-token>"
```

**Respuesta esperada:** `403 Forbidden`

#### Usuario ADMIN_VENUE accediendo a endpoint de ADMIN

```bash
curl -X GET http://localhost:3001/api/v1/users/admin-only \
  -H "Authorization: Bearer <admin-token>"
```

**Respuesta esperada:** `200 OK`

### 6. Refresh Token

```bash
curl -X POST http://localhost:3001/api/v1/auth/refresh \
  -H "Content-Type: application/json" \
  --cookie "refresh_token=<refresh-token>"
```

### 7. Logout

```bash
curl -X POST http://localhost:3001/api/v1/auth/logout \
  -H "Authorization: Bearer <access-token>"
```

## Pruebas de Rate Limiting

### Intentar login 6 veces en 15 minutos

```bash
for i in {1..6}; do
  curl -X POST http://localhost:3001/api/v1/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email": "test@example.com", "password": "wrongpassword"}'
  echo "Intento $i"
done
```

**Respuesta esperada en el 6to intento:** `429 Too Many Requests`

## Pruebas de Google OAuth

### 1. Iniciar flujo de Google

```bash
# Redirección a Google
curl -L http://localhost:3001/api/v1/auth/google
```

### 2. Callback de Google

```
# Esta URL será llamada por Google después de la autenticación
http://localhost:3001/api/v1/auth/google/callback?code=<authorization-code>
```

## Validación de Seguridad

### 1. Cookies HttpOnly

- Verificar que `refresh_token` esté configurado como `HttpOnly`
- JavaScript no puede acceder a la cookie

### 2. Tokens JWT

- Access token expira en 15 minutos
- Refresh token expira en 7 días
- Algoritmo RS256 (en producción) o HS256 (desarrollo)

### 3. CORS

- Solo origenes autorizados pueden hacer requests
- Credenciales habilitadas para cookies

### 4. Validación de Input

- Email debe ser válido
- Contraseña mínimo 8 caracteres
- Roles válidos: USER, STAFF_SCANNER, ADMIN_VENUE

## Scripts de Prueba Automatizados

### Crear usuario de prueba

```bash
# Script para crear usuarios con diferentes roles
node scripts/create-test-users.js
```

### Ejecutar suite de pruebas

```bash
# Pruebas unitarias
npm test

# Pruebas de integración
npm run test:e2e
```

## Solución de Problemas

### Error: "JWT_SECRET no configurado"

```bash
# Agregar en .env.local
JWT_SECRET="tu-clave-secreta-aqui"
```

### Error: "Database connection failed"

```bash
# Verificar que PostgreSQL esté corriendo
psql -U postgres -h localhost -p 5432

# Crear base de datos
createdb -U postgres nightpass
```

### Error: "Invalid refresh token"

- Verificar que la cookie `refresh_token` esté presente
- Verificar que el token no haya expirado
- Verificar configuración de cookies (Secure, SameSite)

### Error: "Role guard failed"

- Verificar que el usuario tenga el rol requerido
- Verificar que el token JWT incluya el claim `role`
- Verificar decorator `@Roles()` en el endpoint

## Monitoreo

### Ver logs de autenticación

```bash
# Buscar en logs del servidor
grep -i "auth\|login\|jwt" logs/app.log
```

### Verificar métricas

- Tasa de éxito/fallo de login
- Intentos bloqueados por rate limiting
- Tiempos de respuesta de endpoints de auth

## Consideraciones de Producción

### 1. Rotación de claves JWT

- Implementar sistema de rotación de claves RSA
- Mantener versión en tokens para manejar múltiples claves

### 2. Monitoreo de seguridad

- Alertas por múltiples intentos fallidos
- Auditoría de logins exitosos/fallidos
- Detección de patrones sospechosos

### 3. Escalabilidad

- Redis para rate limiting distribuido
- Cache de validación de tokens
- Balanceo de carga con sticky sessions para cookies
