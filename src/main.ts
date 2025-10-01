import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import type { Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { AllExceptionsFilter, KboExceptionFilter } from './common/filters';
import {
  CorrelationIdInterceptor,
  LoggingInterceptor,
  PerformanceInterceptor,
  ResponseTransformInterceptor,
} from './common/interceptors';
import { AppConfigService } from './config/config.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Trust proxy for proper IP detection (fixes IP spoofing)
  const expressApp = app.getHttpAdapter().getInstance();
  expressApp.set('trust proxy', 1);

  // Security headers
  app.use(helmet());

  // Enable CORS with explicit origin allowlist
  const allowedOrigins = process.env.CORS_ALLOWED_ORIGINS?.split(',') || [];
  app.enableCors({
    origin: allowedOrigins.length > 0 ? allowedOrigins : false,
    credentials: true,
  });

  // Global prefix for all routes
  app.setGlobalPrefix('api');

  // Global validation pipe with request size limits
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
    })
  );

  // Set body size limits
  app.use((req: Request, res: Response, next: NextFunction) => {
    const contentLength = parseInt(req.headers['content-length'] || '0', 10);
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (contentLength > maxSize) {
      res.status(413).json({ error: 'Payload too large' });
      return;
    }
    next();
  });

  // Global interceptors (order matters - early interceptors run first)
  app.useGlobalInterceptors(
    new CorrelationIdInterceptor(), // Must be first to generate correlation IDs
    new PerformanceInterceptor(), // Track performance metrics
    new LoggingInterceptor(), // Log requests/responses with correlation IDs
    new ResponseTransformInterceptor() // Transform responses to standard format
  );

  // Global exception filters (order matters - specific filters first, then general)
  app.useGlobalFilters(new KboExceptionFilter(), new AllExceptionsFilter());

  const configService = app.get(AppConfigService);
  const port = configService.port;

  await app.listen(port);

  Logger.log(
    `Application is running on: http://localhost:${port}/api`,
    'Bootstrap'
  );
}

void bootstrap();
