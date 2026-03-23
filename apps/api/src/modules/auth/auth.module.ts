import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ThrottlerModule } from '@nestjs/throttler';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersController } from './users.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { GoogleStrategy } from './strategies/google.strategy';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { PrismaModule } from '../../shared/prisma/prisma.module';
import { RATE_LIMIT_CONSTANTS, JWT_CONSTANTS } from './auth.constants';
import { getJwtHsConfig, getJwtRsaConfig } from './strategies/jwt-rsa.config';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      useFactory: () => {
        // Usar RS256 si hay claves disponibles, sino HS256 para desarrollo
        const hasRsaKeys =
          process.env.JWT_PRIVATE_KEY && process.env.JWT_PUBLIC_KEY;

        if (hasRsaKeys) {
          const rsaConfig = getJwtRsaConfig();
          return {
            privateKey: rsaConfig.privateKey,
            publicKey: rsaConfig.publicKey,
            signOptions: {
              expiresIn: JWT_CONSTANTS.ACCESS_TOKEN_EXPIRES_IN,
              algorithm: rsaConfig.algorithm,
            },
            verifyOptions: {
              algorithms: [rsaConfig.algorithm],
            },
          };
        } else {
          const hsConfig = getJwtHsConfig();
          return {
            secret: hsConfig.secret,
            signOptions: {
              expiresIn: JWT_CONSTANTS.ACCESS_TOKEN_EXPIRES_IN,
              algorithm: hsConfig.algorithm,
            },
          };
        }
      },
    }),
    ThrottlerModule.forRoot([
      {
        ttl: RATE_LIMIT_CONSTANTS.WINDOW_MS,
        limit: RATE_LIMIT_CONSTANTS.MAX_LOGIN_ATTEMPTS,
      },
    ]),
    PrismaModule,
  ],
  controllers: [AuthController, UsersController],
  providers: [
    AuthService,
    JwtStrategy,
    GoogleStrategy,
    JwtAuthGuard,
    RolesGuard,
  ],
  exports: [AuthService, JwtModule, JwtAuthGuard, RolesGuard],
})
export class AuthModule {}
