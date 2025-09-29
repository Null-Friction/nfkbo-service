import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { AppConfigService } from './config/config.service';
import { AllExceptionsFilter, KboExceptionFilter } from './common/filters';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS
  app.enableCors();

  // Global prefix for all routes
  app.setGlobalPrefix('api');

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true, // Automatically transform payloads to DTO instances
      transformOptions: {
        enableImplicitConversion: true, // Allow conversion from string to number, boolean, etc.
      },
      whitelist: true, // Strip properties not defined in DTO
      forbidNonWhitelisted: true, // Throw error if non-whitelisted properties are present
      skipMissingProperties: false, // Don't skip validation of missing properties
      validationError: {
        target: false, // Don't include the target object in error response
        value: false, // Don't include the validated value in error response
      },
    }),
  );

  // Global exception filters (order matters - specific filters first, then general)
  app.useGlobalFilters(
    new KboExceptionFilter(),
    new AllExceptionsFilter(),
  );

  const configService = app.get(AppConfigService);
  const port = configService.port;

  await app.listen(port);

  console.log(`Application is running on: http://localhost:${port}/api`);
}

bootstrap();