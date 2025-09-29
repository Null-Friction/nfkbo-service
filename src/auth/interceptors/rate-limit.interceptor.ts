import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { ApiKeyService } from '../services/api-key.service';

interface RateLimitStore {
  count: number;
  resetTime: number;
}

@Injectable()
export class RateLimitInterceptor implements NestInterceptor {
  private rateLimitStore: Map<string, RateLimitStore> = new Map();
  private readonly windowMs: number = 60000; // 1 minute window

  constructor(private readonly apiKeyService: ApiKeyService) {}

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

    // Check if rate limit exceeded
    if (record.count > limit) {
      throw new HttpException(
        {
          statusCode: HttpStatus.TOO_MANY_REQUESTS,
          message: 'Rate limit exceeded',
          retryAfter: new Date(record.resetTime).toISOString(),
        },
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    return next.handle();
  }
}