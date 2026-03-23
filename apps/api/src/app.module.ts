import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { AppController } from './app.controller';

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

    // Los modulos se van añadiendo aqui conforme se implementan:
    // AuthModule,
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
