import { ExceptionFilter, ArgumentsHost } from '@nestjs/common';
import { KBOProviderError } from '../providers/errors';
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
export declare class KboExceptionFilter implements ExceptionFilter {
    private readonly logger;
    catch(exception: KBOProviderError, host: ArgumentsHost): void;
    private getHttpStatus;
    private logKboError;
}
