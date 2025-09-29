import { Injectable } from '@nestjs/common';
import { HealthIndicator, HealthIndicatorResult, HealthCheckError } from '@nestjs/terminus';

@Injectable()
export class MemoryHealthIndicator extends HealthIndicator {
  // Default threshold: 512MB
  private readonly memoryThreshold = 512 * 1024 * 1024; // 512MB in bytes

  async isHealthy(key: string): Promise<HealthIndicatorResult> {
    const memoryUsage = process.memoryUsage();
    const isHealthy = memoryUsage.heapUsed < this.memoryThreshold;

    const result = this.getStatus(key, isHealthy, {
      heapUsed: this.formatBytes(memoryUsage.heapUsed),
      heapTotal: this.formatBytes(memoryUsage.heapTotal),
      rss: this.formatBytes(memoryUsage.rss),
      threshold: this.formatBytes(this.memoryThreshold),
      usage: `${Math.round((memoryUsage.heapUsed / this.memoryThreshold) * 100)}%`,
    });

    if (isHealthy) {
      return result;
    }

    throw new HealthCheckError('Memory Health Check Failed - Memory usage too high', result);
  }

  private formatBytes(bytes: number): string {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${Math.round((bytes / Math.pow(k, i)) * 100) / 100} ${sizes[i]}`;
  }
}