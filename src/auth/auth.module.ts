import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_GUARD, APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { AuthController } from './auth.controller';
import { ApiKeyService } from './services/api-key.service';
import { ApiKeyGuard } from './guards/api-key.guard';
import { AuthExceptionFilter } from './filters/auth-exception.filter';
import { RateLimitInterceptor } from './interceptors/rate-limit.interceptor';
import { ApiKeyEntity } from './entities/api-key-db.entity';

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