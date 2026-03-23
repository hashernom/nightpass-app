import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { AppController } from './app.controller';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [
    // Variables de entorno disponibles en toda la app
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    // Rate limiting global
    ThrottlerModule.forRoot([
      {
        name: 'global',
        ttl: 60000,
        limit: 100,
      },
    ]),

    // Módulo de autenticación
    AuthModule,

    // Los modulos se van añadiendo aqui conforme se implementan:
    // UsersModule,
    // VenuesModule,
    // EventsModule,
    // TicketsModule,
    // PaymentsModule,
    // ScannerModule,
    // NotificationsModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
