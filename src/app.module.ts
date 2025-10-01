import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { ApiKeyEntity } from './auth/entities/api-key-db.entity';
import { AppConfigModule } from './config/config.module';
import { validateConfig } from './config/configuration';
import { HealthModule } from './health/health.module';
import { KboModule } from './kbo/kbo.module';

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
        // Connection pool configuration
        extra: {
          max: 20, // Maximum pool size
          min: 2, // Minimum pool size
          idleTimeoutMillis: 30000, // Close idle connections after 30s
          connectionTimeoutMillis: 2000, // Timeout for acquiring connection
        },
        // Enable trust proxy for proper IP detection behind reverse proxies
        trustProxy: true,
      }),
      inject: [ConfigService],
    }),
    AppConfigModule,
    AuthModule,
    HealthModule,
    KboModule,
  ],
})
export class AppModule {}
