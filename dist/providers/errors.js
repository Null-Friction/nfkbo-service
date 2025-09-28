"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KBOConfigurationError = exports.KBOAuthenticationError = exports.KBORateLimitError = exports.KBONotFoundError = exports.KBONetworkError = exports.KBOValidationError = exports.KBOProviderError = void 0;
exports.isKBOProviderError = isKBOProviderError;
exports.handleHttpError = handleHttpError;
class KBOProviderError extends Error {
    constructor(message, code, statusCode, details) {
        super(message);
        this.name = 'KBOProviderError';
        this.code = code;
        this.statusCode = statusCode;
        this.details = details;
    }
}
exports.KBOProviderError = KBOProviderError;
class KBOValidationError extends KBOProviderError {
    constructor(message, details) {
        super(message, 'VALIDATION_ERROR', undefined, details);
        this.name = 'KBOValidationError';
    }
}
exports.KBOValidationError = KBOValidationError;
class KBONetworkError extends KBOProviderError {
    constructor(message, statusCode, details) {
        super(message, 'NETWORK_ERROR', statusCode, details);
        this.name = 'KBONetworkError';
    }
}
exports.KBONetworkError = KBONetworkError;
class KBONotFoundError extends KBOProviderError {
    constructor(message, details) {
        super(message, 'NOT_FOUND', 404, details);
        this.name = 'KBONotFoundError';
    }
}
exports.KBONotFoundError = KBONotFoundError;
class KBORateLimitError extends KBOProviderError {
    constructor(message, details) {
        super(message, 'RATE_LIMIT', 429, details);
        this.name = 'KBORateLimitError';
    }
}
exports.KBORateLimitError = KBORateLimitError;
class KBOAuthenticationError extends KBOProviderError {
    constructor(message, details) {
        super(message, 'AUTHENTICATION_ERROR', 401, details);
        this.name = 'KBOAuthenticationError';
    }
}
exports.KBOAuthenticationError = KBOAuthenticationError;
class KBOConfigurationError extends KBOProviderError {
    constructor(message, details) {
        super(message, 'CONFIGURATION_ERROR', undefined, details);
        this.name = 'KBOConfigurationError';
    }
}
exports.KBOConfigurationError = KBOConfigurationError;
function isKBOProviderError(error) {
    return error instanceof KBOProviderError;
}
function handleHttpError(error) {
    if (error.response) {
        const { status, statusText, data } = error.response;
        switch (status) {
            case 401:
                throw new KBOAuthenticationError('Authentication failed', { status, statusText, data });
            case 404:
                throw new KBONotFoundError('Resource not found', { status, statusText, data });
            case 429:
                throw new KBORateLimitError('Rate limit exceeded', { status, statusText, data });
            default:
                throw new KBONetworkError(`HTTP ${status}: ${statusText}`, status, { status, statusText, data });
        }
    }
    else if (error.request) {
        throw new KBONetworkError('Network request failed', undefined, { request: error.request });
    }
    else {
        throw new KBOProviderError('Unexpected error occurred', 'UNKNOWN_ERROR', undefined, error);
    }
}
//# sourceMappingURL=errors.js.map