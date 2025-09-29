import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { KboModule } from './kbo/kbo.module';
import { AppConfigModule } from './config/config.module';
import { SharedModule } from './shared/shared.module';
import { HealthModule } from './health/health.module';
import { AuthModule } from './auth/auth.module';
import { validateConfig } from './config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: validateConfig,
      cache: true,
      envFilePath: [
        '.env.local',
        `.env.${process.env.NODE_ENV || 'development'}`,
        '.env',
      ],
    }),
    AppConfigModule,
    SharedModule,
    AuthModule,
    HealthModule,
    KboModule,
  ],
})
export class AppModule {}