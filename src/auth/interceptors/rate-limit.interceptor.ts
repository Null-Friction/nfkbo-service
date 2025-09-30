import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Observable } from 'rxjs';

interface RateLimitStore {
  count: number;
  resetTime: number;
}

@Injectable()
export class RateLimitInterceptor implements NestInterceptor {
  private readonly logger = new Logger(RateLimitInterceptor.name);
  private rateLimitStore: Map<string, RateLimitStore> = new Map();
  private readonly windowMs: number;
  private cleanupInterval: ReturnType<typeof setInterval>;

  constructor(private readonly configService: ConfigService) {
    this.windowMs = this.configService.get<number>(
      'auth.rateLimitWindowMs',
      60000,
    );

    // Cleanup stale entries every 5 minutes to prevent memory exhaustion
    this.cleanupInterval = setInterval(() => {
      this.cleanupStaleEntries();
    }, 5 * 60 * 1000);
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();
    const apiKey = request.apiKey;

    if (!apiKey) {
      // If no API key is attached, skip rate limiting (public endpoint)
      return next.handle();
    }

    const now = Date.now();
    const keyId = apiKey.id;
    const limit = apiKey.rateLimit;

    // Get or create rate limit record
    let record = this.rateLimitStore.get(keyId);

    if (!record || now > record.resetTime) {
      // Create new window
      record = {
        count: 0,
        resetTime: now + this.windowMs,
      };
      this.rateLimitStore.set(keyId, record);
    }

    // Check if rate limit exceeded BEFORE incrementing (prevents race condition)
    if (record.count >= limit) {
      throw new HttpException(
        {
          statusCode: HttpStatus.TOO_MANY_REQUESTS,
          message: 'Rate limit exceeded',
          retryAfter: new Date(record.resetTime).toISOString(),
        },
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    // Increment request count
    record.count++;

    // Set rate limit headers
    response.setHeader('X-RateLimit-Limit', limit.toString());
    response.setHeader(
      'X-RateLimit-Remaining',
      Math.max(0, limit - record.count).toString(),
    );
    response.setHeader(
      'X-RateLimit-Reset',
      new Date(record.resetTime).toISOString(),
    );

    return next.handle();
  }

  private cleanupStaleEntries(): void {
    const now = Date.now();
    let cleanedCount = 0;

    for (const [keyId, record] of this.rateLimitStore.entries()) {
      // Remove entries that are expired + 1 hour (keep some buffer)
      if (now > record.resetTime + 3600000) {
        this.rateLimitStore.delete(keyId);
        cleanedCount++;
      }
    }

    if (cleanedCount > 0) {
      this.logger.log(
        `Cleaned up ${cleanedCount} stale rate limit entries. Current size: ${this.rateLimitStore.size}`,
      );
    }
  }

  // Cleanup on module destroy
  onModuleDestroy() {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }
  }
}