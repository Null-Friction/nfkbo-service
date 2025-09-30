import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TerminusModule } from '@nestjs/terminus';
import { HealthController } from './health.controller';
import { KboProviderHealthIndicator } from './indicators/kbo-provider.health';
import { MemoryHealthIndicator } from './indicators/memory.health';

@Module({
  imports: [
    TerminusModule.forRoot({
      errorLogStyle: 'pretty',
      gracefulShutdownTimeoutMs: 1000,
    }),
    HttpModule,
    ConfigModule,
  ],
  controllers: [HealthController],
  providers: [KboProviderHealthIndicator, MemoryHealthIndicator],
  exports: [KboProviderHealthIndicator, MemoryHealthIndicator],
})
export class HealthModule {}