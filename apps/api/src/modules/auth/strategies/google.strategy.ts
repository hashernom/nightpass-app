import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { AuthService } from '../auth.service';
import { User, AuthProvider } from '@prisma/client';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private readonly authService: AuthService) {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID || 'google-client-id',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'google-client-secret',
      callbackURL:
        process.env.GOOGLE_CALLBACK_URL ||
        'http://localhost:3000/auth/google/callback',
      scope: ['email', 'profile'],
      passReqToCallback: false,
    });
  }

  /**
   * Valida el usuario de Google OAuth
   */
  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<void> {
    try {
      const { id, displayName, emails, photos } = profile;
      const email = emails?.[0]?.value;
      const avatarUrl = photos?.[0]?.value;

      if (!email) {
        return done(new Error('Email no proporcionado por Google'), false);
      }

      // Buscar usuario existente por email
      let user = await this.authService.getPrisma().user.findUnique({
        where: { email },
      });

      if (!user) {
        // Crear nuevo usuario si no existe
        user = await this.authService.getPrisma().user.create({
          data: {
            email,
            name: displayName || email.split('@')[0],
            avatarUrl,
            provider: AuthProvider.GOOGLE,
            role: 'USER', // Rol por defecto para usuarios de Google
            isActive: true,
          },
        });
      } else if (user.provider !== AuthProvider.GOOGLE) {
        // Si el usuario existe pero con otro provider, actualizar
        user = await this.authService.getPrisma().user.update({
          where: { id: user.id },
          data: {
            provider: AuthProvider.GOOGLE,
            avatarUrl: avatarUrl || user.avatarUrl,
          },
        });
      }

      // Retornar el usuario
      done(null, user);
    } catch (error) {
      done(error as Error, false);
    }
  }
}
