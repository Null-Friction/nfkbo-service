import { NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Observable } from 'rxjs';
export declare class RateLimitInterceptor implements NestInterceptor {
    private readonly configService;
    private readonly logger;
    private rateLimitStore;
    private readonly windowMs;
    private cleanupInterval;
    constructor(configService: ConfigService);
    intercept(context: ExecutionContext, next: CallHandler): Observable<any>;
    private cleanupStaleEntries;
    onModuleDestroy(): void;
}
