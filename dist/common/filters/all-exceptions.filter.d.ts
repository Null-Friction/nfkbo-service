import { ExceptionFilter, ArgumentsHost } from '@nestjs/common';
export interface ErrorResponse {
    statusCode: number;
    message: string;
    error: string;
    timestamp: string;
    path: string;
    correlationId?: string;
}
export declare class AllExceptionsFilter implements ExceptionFilter {
    private readonly logger;
    catch(exception: unknown, host: ArgumentsHost): void;
}
