import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AppConfigService } from './config/config.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS
  app.enableCors();

  // Global prefix for all routes
  app.setGlobalPrefix('api');

  const configService = app.get(AppConfigService);
  const port = configService.port;

  await app.listen(port);

  console.log(`Application is running on: http://localhost:${port}/api`);
}

bootstrap();