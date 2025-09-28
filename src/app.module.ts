import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { KboModule } from './kbo/kbo.module';
import { AppConfigModule } from './config/config.module';
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
    KboModule,
  ],
})
export class AppModule {}