import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags, ApiResponse } from '@nestjs/swagger';

/**
 * Controlador principal de la aplicación NightPass API
 *
 * Este controlador maneja endpoints globales y de monitoreo que no pertenecen
 * a un módulo específico. Actualmente solo contiene el endpoint de health check
 * utilizado para verificar el estado del servidor y por sistemas de monitoreo.
 *
 * @remarks
 * - Todos los endpoints aquí son públicos (no requieren autenticación)
 * - Sirve como punto de entrada para verificaciones de disponibilidad
 * - Proporciona información básica sobre la versión y estado del servicio
 *
 * @example
 * ```bash
 * # Ejemplo de solicitud health check
 * curl -X GET http://localhost:3001/api/v1/health
 *
 * # Respuesta esperada
 * {
 *   "status": "ok",
 *   "service": "NightPass API",
 *   "version": "1.0.0",
 *   "timestamp": "2026-03-23T05:00:00.000Z"
 * }
 * ```
 */
@ApiTags('health')
@Controller()
export class AppController {
  /**
   * Health check del servidor API
   *
   * Endpoint utilizado para verificar que la API está funcionando correctamente.
   * Debe ser utilizado por:
   * - Sistemas de monitoreo (Prometheus, Datadog, etc.)
   - Load balancers para health checks
   * - DevOps para verificaciones de despliegue
   * - Clientes para confirmar conectividad
   *
   * @returns {Object} Objeto JSON con estado del servicio
   * @property {string} status - Siempre "ok" si el servidor está funcionando
   * @property {string} service - Nombre del servicio "NightPass API"
   * @property {string} version - Versión semántica de la API
   * @property {string} timestamp - Fecha y hora UTC en formato ISO 8601
   *
   * @example
   * ```typescript
   * // Uso en frontend para verificar conectividad
   * const checkAPI = async () => {
   *   try {
   *     const response = await fetch('/api/v1/health');
   *     const data = await response.json();
   *     return data.status === 'ok';
   *   } catch {
   *     return false;
   *   }
   * };
   * ```
   */
  @Get('health')
  @ApiOperation({
    summary: 'Health check del servidor',
    description: `Verifica que la API está funcionando correctamente.
    
    Este endpoint es utilizado por:
    - Sistemas de monitoreo y alertas
    - Load balancers para determinar si el servidor está saludable
    - Pipelines de CI/CD para verificar despliegues exitosos
    - Clientes para confirmar conectividad antes de realizar operaciones
    
    Respuestas posibles:
    - 200 OK: Servidor funcionando correctamente
    - 5xx: Error del servidor (no saludable)`,
  })
  @ApiResponse({
    status: 200,
    description: 'Servidor funcionando correctamente',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', example: 'ok' },
        service: { type: 'string', example: 'NightPass API' },
        version: { type: 'string', example: '1.0.0' },
        timestamp: { type: 'string', example: '2026-03-23T05:00:00.000Z' },
      },
      required: ['status', 'service', 'version', 'timestamp'],
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Error interno del servidor - servicio no saludable',
  })
  health(): {
    status: string;
    service: string;
    version: string;
    timestamp: string;
  } {
    return {
      status: 'ok',
      service: 'NightPass API',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
    };
  }
}
