import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Request } from 'express';

export interface PerformanceMetrics {
  duration: number;
  memoryUsage: NodeJS.MemoryUsage;
  isSlowRequest: boolean;
  endpoint: string;
  method: string;
  statusCode?: number;
}

@Injectable()
export class PerformanceInterceptor implements NestInterceptor {
  private readonly logger = new Logger(PerformanceInterceptor.name);
  private readonly slowRequestThreshold = 1000; // 1 second
  private readonly verySlowRequestThreshold = 5000; // 5 seconds
  private readonly requestCounts = new Map<string, number>();
  private readonly responseTimes = new Map<string, number[]>();

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>();
    const correlationId = request.headers['x-correlation-id'] as string;
    const startTime = process.hrtime.bigint();
    const startMemory = process.memoryUsage();
    const endpoint = `${request.method} ${request.route?.path || request.url}`;

    // Track request count
    this.incrementRequestCount(endpoint);

    return next.handle().pipe(
      tap({
        next: () => {
          const metrics = this.calculateMetrics(startTime, startMemory, request);
          this.logPerformanceMetrics(metrics, correlationId);
          this.trackResponseTime(endpoint, metrics.duration);
        },
        error: (error) => {
          const metrics = this.calculateMetrics(startTime, startMemory, request, error.status);
          this.logPerformanceMetrics(metrics, correlationId, true);
          this.trackResponseTime(endpoint, metrics.duration);
        },
      }),
    );
  }

  private calculateMetrics(
    startTime: bigint,
    startMemory: NodeJS.MemoryUsage,
    request: Request,
    statusCode?: number,
  ): PerformanceMetrics {
    const endTime = process.hrtime.bigint();
    const duration = Number(endTime - startTime) / 1_000_000; // Convert to milliseconds
    const currentMemory = process.memoryUsage();

    const memoryUsage = {
      rss: currentMemory.rss - startMemory.rss,
      heapTotal: currentMemory.heapTotal - startMemory.heapTotal,
      heapUsed: currentMemory.heapUsed - startMemory.heapUsed,
      external: currentMemory.external - startMemory.external,
      arrayBuffers: currentMemory.arrayBuffers - startMemory.arrayBuffers,
    };

    return {
      duration,
      memoryUsage,
      isSlowRequest: duration > this.slowRequestThreshold,
      endpoint: `${request.method} ${request.route?.path || request.url}`,
      method: request.method,
      statusCode,
    };
  }

  private logPerformanceMetrics(
    metrics: PerformanceMetrics,
    correlationId?: string,
    isError: boolean = false,
  ): void {
    const { duration, memoryUsage, endpoint, isSlowRequest } = metrics;

    // Log performance metrics
    const logData = {
      type: 'PERFORMANCE',
      correlationId,
      metrics: {
        duration: Math.round(duration * 100) / 100, // Round to 2 decimal places
        memoryDelta: {
          rss: this.formatBytes(memoryUsage.rss),
          heapUsed: this.formatBytes(memoryUsage.heapUsed),
        },
        endpoint,
        isSlowRequest,
        isVerySlowRequest: duration > this.verySlowRequestThreshold,
      },
      timestamp: new Date().toISOString(),
    };

    // Log with appropriate level based on performance
    if (duration > this.verySlowRequestThreshold || isError) {
      this.logger.error(`Very slow request: ${endpoint} took ${Math.round(duration)}ms`, logData);
    } else if (isSlowRequest) {
      this.logger.warn(`Slow request: ${endpoint} took ${Math.round(duration)}ms`, logData);
    } else {
      this.logger.debug(`Request performance: ${endpoint} - ${Math.round(duration)}ms`, logData);
    }

    // Log memory alerts if significant
    if (memoryUsage.heapUsed > 50 * 1024 * 1024) { // > 50MB
      this.logger.warn(`High memory usage detected for ${endpoint}`, {
        type: 'MEMORY_ALERT',
        correlationId,
        memoryUsage: this.formatBytes(memoryUsage.heapUsed),
        endpoint,
      });
    }
  }

  private incrementRequestCount(endpoint: string): void {
    const currentCount = this.requestCounts.get(endpoint) || 0;
    this.requestCounts.set(endpoint, currentCount + 1);
  }

  private trackResponseTime(endpoint: string, duration: number): void {
    const times = this.responseTimes.get(endpoint) || [];
    times.push(duration);

    // Keep only last 100 response times per endpoint
    if (times.length > 100) {
      times.shift();
    }

    this.responseTimes.set(endpoint, times);

    // Log statistics periodically (every 50 requests)
    if (times.length % 50 === 0) {
      this.logEndpointStatistics(endpoint, times);
    }
  }

  private logEndpointStatistics(endpoint: string, responseTimes: number[]): void {
    const sortedTimes = [...responseTimes].sort((a, b) => a - b);
    const avg = responseTimes.reduce((sum, time) => sum + time, 0) / responseTimes.length;
    const p50 = sortedTimes[Math.floor(sortedTimes.length * 0.5)];
    const p90 = sortedTimes[Math.floor(sortedTimes.length * 0.9)];
    const p95 = sortedTimes[Math.floor(sortedTimes.length * 0.95)];

    this.logger.log(`Endpoint statistics for ${endpoint}`, {
      type: 'ENDPOINT_STATS',
      endpoint,
      statistics: {
        requestCount: this.requestCounts.get(endpoint),
        averageTime: Math.round(avg),
        p50: Math.round(p50),
        p90: Math.round(p90),
        p95: Math.round(p95),
        slowRequests: responseTimes.filter(t => t > this.slowRequestThreshold).length,
        verySlowRequests: responseTimes.filter(t => t > this.verySlowRequestThreshold).length,
      },
      timestamp: new Date().toISOString(),
    });
  }

  private formatBytes(bytes: number): string {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(Math.abs(bytes)) / Math.log(k));
    return `${Math.round((bytes / Math.pow(k, i)) * 100) / 100} ${sizes[i]}`;
  }
}