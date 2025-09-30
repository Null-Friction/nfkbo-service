import { Controller, Get, Logger } from '@nestjs/common';
import {
  HealthCheckService,
  HealthCheck,
  HttpHealthIndicator,
} from '@nestjs/terminus';
import { Public } from '../auth/decorators/public.decorator';
import { KboProviderHealthIndicator } from './indicators/kbo-provider.health';
import { MemoryHealthIndicator } from './indicators/memory.health';

@Controller('health')
@Public()
export class HealthController {
  private readonly logger = new Logger(HealthController.name);

  constructor(
    private readonly health: HealthCheckService,
    private readonly http: HttpHealthIndicator,
    private readonly kboProvider: KboProviderHealthIndicator,
    private readonly memory: MemoryHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  async check() {
    this.logger.log('Performing comprehensive health check');
    return this.health.check([
      () => this.http.pingCheck('nestjs-service', 'https://nestjs.com'),
      () => this.kboProvider.isHealthy('kbo-provider'),
      () => this.memory.isHealthy('memory'),
    ]);
  }

  @Get('live')
  @HealthCheck()
  async checkLiveness() {
    this.logger.log('Performing liveness probe check');
    // Liveness probe should be minimal - just check if the service is running
    return this.health.check([
      () => this.memory.isHealthy('memory'),
    ]);
  }

  @Get('ready')
  @HealthCheck()
  async checkReadiness() {
    this.logger.log('Performing readiness probe check');
    // Readiness probe should check dependencies
    return this.health.check([
      () => this.kboProvider.isHealthy('kbo-provider'),
      () => this.memory.isHealthy('memory'),
    ]);
  }
}