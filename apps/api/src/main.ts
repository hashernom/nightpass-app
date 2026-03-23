import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Seguridad — helmet
  app.use(helmet());

  // CORS — solo origenes autorizados
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  });

  // Prefijo global de la API
  app.setGlobalPrefix('api/v1');

  // Validacion global de DTOs
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Swagger — solo en desarrollo
  if (process.env.NODE_ENV !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('NightPass API')
      .setDescription(
        `API REST completa del sistema de ticketing NightPass para vida nocturna.

## 📋 Descripción General
NightPass es una plataforma de ticketing B2C y B2B que permite:
- Compra de covers y reservas de palcos
- Validación de QR en puerta con firma HMAC
- Gestión de eventos y venues
- Panel administrativo B2B
- Integración con Stripe y Wompi para pagos

## 🔐 Autenticación
La API utiliza JWT Bearer tokens. Incluye el token en el header:
\`Authorization: Bearer <token>\`

## 📊 Roles del Sistema
- **USER**: Comprador de tickets
- **STAFF_SCANNER**: Validador de QR en puerta
- **ADMIN_VENUE**: Administrador de establecimiento

## 🚀 Endpoints Principales
| Módulo | Descripción |
|--------|-------------|
| /auth | Autenticación y registro |
| /users | Gestión de perfil de usuario |
| /venues | Catálogo de establecimientos |
| /events | Eventos y programación |
| /tickets | Compra y gestión de tickets |
| /payments | Procesamiento de pagos |
| /scanner | Validación de QR |
| /admin | Panel B2B para venues |

## 📝 Convenciones
- Prefijo global: \`/api/v1\`
- Todas las respuestas siguen formato JSON
- Códigos de error estandarizados
- Rate limiting: 100 req/min por IP
- Validación automática de DTOs con class-validator`,
      )
      .setVersion('1.0.0')
      .addBearerAuth(
        {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Introduce el token JWT sin la palabra "Bearer"',
        },
        'JWT-auth',
      )
      .addTag('auth', 'Autenticación y registro de usuarios')
      .addTag('users', 'Gestión de perfiles de usuario')
      .addTag('venues', 'Catálogo y gestión de establecimientos')
      .addTag('events', 'Eventos, programación y disponibilidad')
      .addTag('tickets', 'Compra, validación y gestión de tickets')
      .addTag('payments', 'Procesamiento de pagos y webhooks')
      .addTag('scanner', 'Validación de QR en puerta')
      .addTag('admin', 'Panel administrativo B2B')
      .addTag('health', 'Monitoreo y estado del servicio')
      .setContact(
        'Soporte NightPass',
        'https://nightpass.com/support',
        'support@nightpass.com',
      )
      .setLicense('MIT', 'https://opensource.org/licenses/MIT')
      .build();

    const document = SwaggerModule.createDocument(app, config, {
      deepScanRoutes: true,
      extraModels: [],
    });

    SwaggerModule.setup('api/docs', app, document, {
      customSiteTitle: 'NightPass API Documentation',
      customfavIcon: 'https://nightpass.com/favicon.ico',
      customCss: '.swagger-ui .topbar { display: none }',
      swaggerOptions: {
        persistAuthorization: true,
        docExpansion: 'list',
        filter: true,
        showExtensions: true,
        showCommonExtensions: true,
      },
    });

    console.warn(
      `📚 Swagger UI disponible en: http://localhost:${process.env.PORT || 3001}/api/docs`,
    );
    console.warn(
      `📄 OpenAPI spec disponible en: http://localhost:${process.env.PORT || 3001}/api/docs-json`,
    );
  }

  const port = process.env.PORT || 3001;
  await app.listen(port);
  console.warn(`NightPass API corriendo en: http://localhost:${port}`);
}

bootstrap();
