import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KboModule } from './kbo/kbo.module';
import { AppConfigModule } from './config/config.module';
import { SharedModule } from './shared/shared.module';
import { HealthModule } from './health/health.module';
import { AuthModule } from './auth/auth.module';
import { validateConfig } from './config/configuration';
import { ApiKeyEntity } from './auth/entities/api-key-db.entity';

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
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('database.host'),
        port: configService.get<number>('database.port'),
        username: configService.get<string>('database.username'),
        password: configService.get<string>('database.password'),
        database: configService.get<string>('database.database'),
        entities: [ApiKeyEntity],
        synchronize: configService.get<boolean>('database.synchronize'),
        logging: configService.get<boolean>('database.logging'),
      }),
      inject: [ConfigService],
    }),
    AppConfigModule,
    SharedModule,
    AuthModule,
    HealthModule,
    KboModule,
  ],
})
export class AppModule {}