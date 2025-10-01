import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import {
  KBOProviderError,
  KBONotFoundError,
  KBOValidationError,
  KBORateLimitError,
  KBOAuthenticationError,
  KBONetworkError,
  KBOConfigurationError,
} from '../providers/errors';

export interface KboFilterErrorResponse {
  statusCode: number;
  message: string;
  error: string;
  code: string;
  timestamp: string;
  path: string;
  correlationId?: string;
  details?: unknown;
}

@Catch(KBOProviderError)
export class KboExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(KboExceptionFilter.name);

  catch(exception: KBOProviderError, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status = this.getHttpStatus(exception);
    const correlationId = request.headers['x-correlation-id'] as string;

    const errorResponse: KboFilterErrorResponse = {
      statusCode: status,
      message: exception.message,
      error: exception.name,
      code: exception.code,
      timestamp: new Date().toISOString(),
      path: request.url,
      ...(correlationId ? { correlationId } : {}),
      ...(exception.details ? { details: exception.details } : {}),
    };

    // Log KBO-specific errors with appropriate log level
    this.logKboError(exception, request, correlationId);

    response.status(status).json(errorResponse);
  }

  private getHttpStatus(exception: KBOProviderError): number {
    if (exception.statusCode) {
      return exception.statusCode;
    }

    // Map KBO-specific exceptions to HTTP status codes
    if (exception instanceof KBONotFoundError) {
      return HttpStatus.NOT_FOUND;
    }

    if (exception instanceof KBOValidationError) {
      return HttpStatus.BAD_REQUEST;
    }

    if (exception instanceof KBORateLimitError) {
      return HttpStatus.TOO_MANY_REQUESTS;
    }

    if (exception instanceof KBOAuthenticationError) {
      return HttpStatus.UNAUTHORIZED;
    }

    if (exception instanceof KBONetworkError) {
      return HttpStatus.BAD_GATEWAY;
    }

    if (exception instanceof KBOConfigurationError) {
      return HttpStatus.INTERNAL_SERVER_ERROR;
    }

    return HttpStatus.INTERNAL_SERVER_ERROR;
  }

  private logKboError(
    exception: KBOProviderError,
    request: Request,
    correlationId?: string
  ): void {
    const context = {
      exception: {
        name: exception.name,
        code: exception.code,
        message: exception.message,
        statusCode: exception.statusCode,
        details: exception.details,
      },
      request: {
        method: request.method,
        url: request.url,
        userAgent: request.headers['user-agent'],
      },
      correlationId,
    };

    const logMessage = `KBO Error: ${exception.code} - ${exception.message} [${request.method} ${request.url}]`;

    // Use different log levels based on error type
    if (exception instanceof KBONotFoundError) {
      this.logger.warn(logMessage, context);
    } else if (exception instanceof KBOValidationError) {
      this.logger.warn(logMessage, context);
    } else if (exception instanceof KBORateLimitError) {
      this.logger.warn(logMessage, context);
    } else if (exception instanceof KBOAuthenticationError) {
      this.logger.error(logMessage, context);
    } else if (exception instanceof KBONetworkError) {
      this.logger.error(logMessage, context);
    } else if (exception instanceof KBOConfigurationError) {
      this.logger.error(logMessage, context);
    } else {
      this.logger.error(logMessage, context);
    }
  }
}
