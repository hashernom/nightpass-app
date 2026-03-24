import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService, JwtPayload } from '../auth.service';
import { User } from '@prisma/client';
import { Request } from 'express';
import { COOKIE_CONSTANTS } from '../auth.constants';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: (req: Request) => {
        // 1. Intentar obtener el token del header Authorization
        const authHeader = ExtractJwt.fromAuthHeaderAsBearerToken()(req);
        if (authHeader) {
          return authHeader;
        }

        // 2. Intentar obtener el token de la cookie
        const cookieToken = req.cookies?.[COOKIE_CONSTANTS.ACCESS_TOKEN_NAME];
        if (cookieToken) {
          return cookieToken;
        }

        return null;
      },
      ignoreExpiration: false,
      secretOrKeyProvider: (
        request: any,
        rawJwtToken: string,
        done: (err: any, secret?: string) => void,
      ) => {
        // En producción, esto leería la clave pública desde archivo o variable de entorno
        // Por ahora usamos una clave secreta temporal
        const secret =
          process.env.JWT_SECRET || 'temporal-secret-key-for-development';
        done(null, secret);
      },
      algorithms: ['HS256'], // Temporalmente HS256, luego cambiaremos a RS256
    });
  }

  /**
   * Valida el payload del JWT y retorna el usuario
   */
  async validate(payload: JwtPayload): Promise<User> {
    const user = await this.authService.validateUser(payload.sub);

    if (!user) {
      throw new UnauthorizedException('Usuario no encontrado o inactivo');
    }

    return user;
  }
}
