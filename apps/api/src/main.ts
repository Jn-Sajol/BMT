import { NestFactory } from '@nestjs/core';
import { VersioningType, ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { loadEnvConfig } from './common/config/env.config';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';

async function bootstrap() {
  // Validate env settings before starting the runtime
  const config = loadEnvConfig();

  const app = await NestFactory.create(AppModule);

  // Security configuration
  app.use(helmet());
  app.enableCors({
    origin: '*', // Enforce strict cors in production settings
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Accept, Authorization, x-request-id',
  });

  // Global Prefix and Versioning Configuration
  app.setGlobalPrefix('api');
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  // Global Pipelines & Adapters
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );
  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalFilters(new AllExceptionsFilter());

  // Enable Graceful Shutdown hooks
  app.enableShutdownHooks();

  // Swagger Documentation Setup
  const swaggerConfig = new DocumentBuilder()
    .setTitle('JNS Marketing OS API')
    .setDescription('Enterprise-grade REST API backend for campaign and channel automation')
    .setVersion('1.0.0')
    .addBearerAuth()
    .build();
  
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, document);

  const port = config.API_PORT;
  await app.listen(port);
  console.log(`🚀 Server launched successfully on port: ${port}`);
  console.log(`📋 API Health Check: http://localhost:${port}/api/v1/health`);
  console.log(`📖 API Documentation: http://localhost:${port}/api/docs`);
}

bootstrap();
