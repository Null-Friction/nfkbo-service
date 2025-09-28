export class KBOProviderError extends Error {
  public readonly code: string;
  public readonly statusCode?: number;
  public readonly details?: unknown;

  constructor(message: string, code: string, statusCode?: number, details?: unknown) {
    super(message);
    this.name = 'KBOProviderError';
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;
  }
}

export class KBOValidationError extends KBOProviderError {
  constructor(message: string, details?: unknown) {
    super(message, 'VALIDATION_ERROR', undefined, details);
    this.name = 'KBOValidationError';
  }
}

export class KBONetworkError extends KBOProviderError {
  constructor(message: string, statusCode?: number, details?: unknown) {
    super(message, 'NETWORK_ERROR', statusCode, details);
    this.name = 'KBONetworkError';
  }
}

export class KBONotFoundError extends KBOProviderError {
  constructor(message: string, details?: unknown) {
    super(message, 'NOT_FOUND', 404, details);
    this.name = 'KBONotFoundError';
  }
}

export class KBORateLimitError extends KBOProviderError {
  constructor(message: string, details?: unknown) {
    super(message, 'RATE_LIMIT', 429, details);
    this.name = 'KBORateLimitError';
  }
}

export class KBOAuthenticationError extends KBOProviderError {
  constructor(message: string, details?: unknown) {
    super(message, 'AUTHENTICATION_ERROR', 401, details);
    this.name = 'KBOAuthenticationError';
  }
}

export class KBOConfigurationError extends KBOProviderError {
  constructor(message: string, details?: unknown) {
    super(message, 'CONFIGURATION_ERROR', undefined, details);
    this.name = 'KBOConfigurationError';
  }
}

export function isKBOProviderError(error: unknown): error is KBOProviderError {
  return error instanceof KBOProviderError;
}

export function handleHttpError(error: any): never {
  if (error.response) {
    const { status, statusText, data } = error.response;

    switch (status) {
      case 401:
        throw new KBOAuthenticationError(
          'Authentication failed',
          { status, statusText, data }
        );
      case 404:
        throw new KBONotFoundError(
          'Resource not found',
          { status, statusText, data }
        );
      case 429:
        throw new KBORateLimitError(
          'Rate limit exceeded',
          { status, statusText, data }
        );
      default:
        throw new KBONetworkError(
          `HTTP ${status}: ${statusText}`,
          status,
          { status, statusText, data }
        );
    }
  } else if (error.request) {
    throw new KBONetworkError(
      'Network request failed',
      undefined,
      { request: error.request }
    );
  } else {
    throw new KBOProviderError(
      'Unexpected error occurred',
      'UNKNOWN_ERROR',
      undefined,
      error
    );
  }
}