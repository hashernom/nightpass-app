import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { AppController } from './app.controller';
import { AuthModule } from './modules/auth/auth.module';
import { VenuesModule } from './modules/venues/venues.module';
import { EventsModule } from './modules/events/events.module';

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
      {
        name: 'auth',
        ttl: 60000,
        limit: 10, // Más estricto para endpoints de autenticación
      },
    ]),

    // Módulo de autenticación
    AuthModule,

    // Módulos de negocio
    VenuesModule,
    EventsModule,

    // Los modulos se van añadiendo aqui conforme se implementan:
    // UsersModule,
    // TicketsModule,
    // PaymentsModule,
    // ScannerModule,
    // NotificationsModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
