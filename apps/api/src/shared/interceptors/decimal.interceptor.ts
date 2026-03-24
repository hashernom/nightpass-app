import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

/**
 * Interceptor que transforma objetos Decimal de Prisma a números JavaScript.
 * Prisma devuelve objetos Decimal que no son serializables directamente a JSON.
 */
@Injectable()
export class DecimalInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(map((data) => this.transformDecimals(data)));
  }

  /**
   * Transforma recursivamente objetos Decimal a números.
   */
  private transformDecimals(data: any): any {
    if (data === null || data === undefined) {
      return data;
    }

    // Si es un objeto Decimal de Prisma
    if (typeof data === 'object' && data !== null) {
      // Verificar si es un objeto Decimal de Prisma (tiene propiedades específicas)
      if (this.isPrismaDecimal(data)) {
        return parseFloat(data.toString());
      }

      // Si es un array, transformar cada elemento
      if (Array.isArray(data)) {
        return data.map((item) => this.transformDecimals(item));
      }

      // Si es un objeto regular, transformar cada propiedad
      const transformed: any = {};
      for (const key in data) {
        if (Object.prototype.hasOwnProperty.call(data, key)) {
          transformed[key] = this.transformDecimals(data[key]);
        }
      }
      return transformed;
    }

    // Si no es un objeto, retornar tal cual
    return data;
  }

  /**
   * Verifica si un objeto es un Decimal de Prisma.
   * Los objetos Decimal de Prisma tienen métodos específicos.
   */
  private isPrismaDecimal(obj: any): boolean {
    return (
      typeof obj === 'object' &&
      obj !== null &&
      typeof obj.toString === 'function' &&
      typeof obj.toNumber === 'function' &&
      typeof obj.toFixed === 'function' &&
      !Array.isArray(obj)
    );
  }
}
