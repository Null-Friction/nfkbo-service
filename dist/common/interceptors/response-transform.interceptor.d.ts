import { NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
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
export declare class ResponseTransformInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<StandardResponse>;
}
