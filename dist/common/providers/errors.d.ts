export declare class KBOProviderError extends Error {
    readonly code: string;
    readonly statusCode?: number;
    readonly details?: unknown;
    constructor(message: string, code: string, statusCode?: number, details?: unknown);
}
export declare class KBOValidationError extends KBOProviderError {
    constructor(message: string, details?: unknown);
}
export declare class KBONetworkError extends KBOProviderError {
    constructor(message: string, statusCode?: number, details?: unknown);
}
export declare class KBONotFoundError extends KBOProviderError {
    constructor(message: string, details?: unknown);
}
export declare class KBORateLimitError extends KBOProviderError {
    constructor(message: string, details?: unknown);
}
export declare class KBOAuthenticationError extends KBOProviderError {
    constructor(message: string, details?: unknown);
}
export declare class KBOConfigurationError extends KBOProviderError {
    constructor(message: string, details?: unknown);
}
export declare function isKBOProviderError(error: unknown): error is KBOProviderError;
export declare function handleHttpError(error: any): never;
