import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

/**
 * Servicio de Prisma ORM para la conexión con la base de datos PostgreSQL
 *
 * Este servicio extiende `PrismaClient` y maneja el ciclo de vida de la conexión
 * a la base de datos, conectándose automáticamente al iniciar el módulo y
 * desconectándose al destruirlo.
 *
 * @example
 * ```typescript
 * // Inyección de dependencia en un servicio
 * constructor(private prisma: PrismaService) {}
 *
 * // Uso para consultas
 * const users = await this.prisma.user.findMany();
 * ```
 *
 * @remarks
 * - Utiliza el cliente Prisma generado a partir del schema.prisma
 * - Implementa `OnModuleInit` y `OnModuleDestroy` para gestión automática
 * - Proporciona acceso a todas las operaciones CRUD de las 9 tablas del sistema
 *
 * @see {@link https://www.prisma.io/docs Prisma Documentation}
 * @see {@link https://docs.nestjs.com/recipes/prisma NestJS Prisma Recipe}
 */
@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  /**
   * Inicializa la conexión con la base de datos cuando el módulo se carga
   *
   * Este método es llamado automáticamente por NestJS cuando el módulo que
   * contiene este servicio es inicializado. Establece la conexión con
   * PostgreSQL usando la URL definida en `DATABASE_URL`.
   *
   * @throws {Prisma.PrismaClientKnownRequestError} Si la conexión falla
   * @returns {Promise<void>} Promesa que se resuelve cuando la conexión es exitosa
   *
   * @example
   * ```typescript
   * // La conexión se establece automáticamente al arrancar la aplicación
   * await app.listen(3000); // onModuleInit se ejecuta antes
   * ```
   */
  async onModuleInit(): Promise<void> {
    await this.$connect();
    console.log('PrismaService: Conexión a PostgreSQL establecida');
  }

  /**
   * Cierra la conexión con la base de datos cuando el módulo se destruye
   *
   * Este método es llamado automáticamente por NestJS cuando la aplicación
   * se está apagando. Cierra limpiamente la conexión con PostgreSQL para
   * evitar conexiones huérfanas y liberar recursos del sistema.
   *
   * @returns {Promise<void>} Promesa que se resuelve cuando la desconexión es exitosa
   *
   * @example
   * ```typescript
   * // La desconexión ocurre automáticamente al cerrar la aplicación
   * process.on('SIGTERM', () => app.close()); // onModuleDestroy se ejecuta después
   * ```
   */
  async onModuleDestroy(): Promise<void> {
    await this.$disconnect();
    console.log('PrismaService: Conexión a PostgreSQL cerrada');
  }
}
