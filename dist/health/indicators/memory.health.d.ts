import { HealthIndicator, HealthIndicatorResult } from '@nestjs/terminus';
export declare class MemoryHealthIndicator extends HealthIndicator {
    private readonly memoryThreshold;
    isHealthy(key: string): Promise<HealthIndicatorResult>;
    private formatBytes;
}
