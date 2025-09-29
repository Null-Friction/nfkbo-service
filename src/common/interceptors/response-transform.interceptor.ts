import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Request } from 'express';

export interface StandardResponse<T = any> {
  success: true;
  data: T;
  meta: {
    timestamp: string;
    requestId?: string;
    responseTime?: number;
  };
}

export interface StandardErrorResponse {
  success: false;
  error: {
    message: string;
    code?: string;
    details?: any;
  };
  meta: {
    timestamp: string;
    requestId?: string;
    responseTime?: number;
  };
}

@Injectable()
export class ResponseTransformInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<StandardResponse> {
    const request = context.switchToHttp().getRequest<Request>();
    const correlationId = request.headers['x-correlation-id'] as string;
    const startTime = Date.now();

    return next.handle().pipe(
      map((data) => {
        const endTime = Date.now();
        const responseTime = endTime - startTime;

        // Don't transform if data is already in our standard format
        if (data && typeof data === 'object' && 'success' in data && 'meta' in data) {
          return data;
        }

        // Handle null or undefined responses
        if (data === null || data === undefined) {
          return {
            success: true,
            data: null,
            meta: {
              timestamp: new Date().toISOString(),
              requestId: correlationId,
              responseTime,
            },
          };
        }

        // Transform response to standard format
        return {
          success: true,
          data,
          meta: {
            timestamp: new Date().toISOString(),
            requestId: correlationId,
            responseTime,
          },
        };
      }),
    );
  }
}