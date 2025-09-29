import { HealthCheckService, HttpHealthIndicator } from '@nestjs/terminus';
import { KboProviderHealthIndicator } from './indicators/kbo-provider.health';
import { MemoryHealthIndicator } from './indicators/memory.health';
export declare class HealthController {
    private readonly health;
    private readonly http;
    private readonly kboProvider;
    private readonly memory;
    private readonly logger;
    constructor(health: HealthCheckService, http: HttpHealthIndicator, kboProvider: KboProviderHealthIndicator, memory: MemoryHealthIndicator);
    check(): Promise<import("@nestjs/terminus").HealthCheckResult>;
    checkLiveness(): Promise<import("@nestjs/terminus").HealthCheckResult>;
    checkReadiness(): Promise<import("@nestjs/terminus").HealthCheckResult>;
}
