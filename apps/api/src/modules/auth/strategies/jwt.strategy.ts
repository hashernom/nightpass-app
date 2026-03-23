import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService, JwtPayload } from '../auth.service';
import { User } from '@prisma/client';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
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
