import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();
    const correlationId = request.headers['x-correlation-id'] as string;
    const startTime = Date.now();

    // Log request
    this.logRequest(request, correlationId);

    return next.handle().pipe(
      tap({
        next: (responseBody) => {
          const endTime = Date.now();
          const duration = endTime - startTime;
          this.logResponse(
            request,
            response,
            responseBody,
            duration,
            correlationId
          );
        },
        error: (error) => {
          const endTime = Date.now();
          const duration = endTime - startTime;
          this.logError(request, response, error, duration, correlationId);
        },
      })
    );
  }

  private logRequest(request: Request, correlationId?: string): void {
    const { method, url, headers, body, query, params } = request;
    const userAgent = headers['user-agent'] || 'Unknown';
    const contentType = headers['content-type'];
    const clientIp = request.ip || request.socket.remoteAddress || 'unknown';

    this.logger.log(`Incoming ${method} ${url}`, {
      type: 'REQUEST',
      correlationId,
      request: {
        method,
        url,
        userAgent,
        clientIp,
        contentType,
        query: Object.keys(query || {}).length > 0 ? query : undefined,
        params: Object.keys(params || {}).length > 0 ? params : undefined,
        bodySize: body ? JSON.stringify(body).length : 0,
        headers: {
          authorization: headers.authorization ? '[REDACTED]' : undefined,
          'content-length': headers['content-length'],
          accept: headers.accept,
        },
      },
      timestamp: new Date().toISOString(),
    });
  }

  private logResponse(
    request: Request,
    response: Response,
    responseBody: any,
    duration: number,
    correlationId?: string
  ): void {
    const { method, url } = request;
    const { statusCode } = response;

    const logLevel =
      statusCode >= 400 ? 'error' : statusCode >= 300 ? 'warn' : 'log';
    const isSlowRequest = duration > 1000; // Slow query detection

    this.logger[logLevel](
      `${method} ${url} - ${statusCode} in ${duration}ms${isSlowRequest ? ' (SLOW)' : ''}`,
      {
        type: 'RESPONSE',
        correlationId,
        response: {
          statusCode,
          duration,
          bodySize: responseBody ? JSON.stringify(responseBody).length : 0,
          contentType: response.getHeader('content-type'),
          slow: isSlowRequest,
        },
        request: {
          method,
          url,
        },
        timestamp: new Date().toISOString(),
      }
    );

    // Log slow requests with warning level
    if (isSlowRequest && statusCode < 400) {
      this.logger.warn(
        `Slow request detected: ${method} ${url} took ${duration}ms`,
        {
          type: 'SLOW_REQUEST',
          correlationId,
          duration,
          threshold: 1000,
        }
      );
    }
  }

  private logError(
    request: Request,
    _response: Response,
    error: any,
    duration: number,
    correlationId?: string
  ): void {
    const { method, url } = request;
    const statusCode = error.status || error.statusCode || 500;

    this.logger.error(
      `${method} ${url} - ERROR ${statusCode} in ${duration}ms: ${error.message}`,
      {
        type: 'ERROR',
        correlationId,
        error: {
          name: error.name,
          message: error.message,
          code: error.code,
          stack: error.stack,
        },
        response: {
          statusCode,
          duration,
        },
        request: {
          method,
          url,
        },
        timestamp: new Date().toISOString(),
      }
    );
  }
}
