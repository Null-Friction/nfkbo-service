import { Module } from '@nestjs/common';
import { APP_GUARD, APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './auth.controller';
import { ApiKeyEntity } from './entities/api-key-db.entity';
import { AuthExceptionFilter } from './filters/auth-exception.filter';
import { ApiKeyGuard } from './guards/api-key.guard';
import { RateLimitInterceptor } from './interceptors/rate-limit.interceptor';
import { ApiKeyService } from './services/api-key.service';

@Module({
  imports: [TypeOrmModule.forFeature([ApiKeyEntity])],
  controllers: [AuthController],
  providers: [
    ApiKeyService,
    {
      provide: APP_GUARD,
      useClass: ApiKeyGuard,
    },
    {
      provide: APP_FILTER,
      useClass: AuthExceptionFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: RateLimitInterceptor,
    },
  ],
  exports: [ApiKeyService],
})
export class AuthModule {}