import { NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
export interface PerformanceMetrics {
    duration: number;
    memoryUsage: NodeJS.MemoryUsage;
    isSlowRequest: boolean;
    endpoint: string;
    method: string;
    statusCode?: number;
}
export declare class PerformanceInterceptor implements NestInterceptor {
    private readonly logger;
    private readonly slowRequestThreshold;
    private readonly verySlowRequestThreshold;
    private readonly requestCounts;
    private readonly responseTimes;
    intercept(context: ExecutionContext, next: CallHandler): Observable<any>;
    private calculateMetrics;
    private logPerformanceMetrics;
    private incrementRequestCount;
    private trackResponseTime;
    private logEndpointStatistics;
    private formatBytes;
}
