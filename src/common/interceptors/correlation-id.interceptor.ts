import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Request, Response } from 'express';
import { randomUUID } from 'crypto';

@Injectable()
export class CorrelationIdInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();

    // Get or generate correlation ID
    let correlationId = request.headers['x-correlation-id'] as string;

    if (!correlationId) {
      correlationId = randomUUID();
    }

    // Add correlation ID to request headers for downstream use
    request.headers['x-correlation-id'] = correlationId;

    // Add correlation ID to response headers
    response.setHeader('X-Correlation-Id', correlationId);

    return next.handle();
  }
}