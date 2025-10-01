"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var LoggingInterceptor_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoggingInterceptor = void 0;
const common_1 = require("@nestjs/common");
const operators_1 = require("rxjs/operators");
let LoggingInterceptor = LoggingInterceptor_1 = class LoggingInterceptor {
    constructor() {
        this.logger = new common_1.Logger(LoggingInterceptor_1.name);
    }
    intercept(context, next) {
        const request = context.switchToHttp().getRequest();
        const response = context.switchToHttp().getResponse();
        const correlationId = request.headers['x-correlation-id'];
        const startTime = Date.now();
        this.logRequest(request, correlationId);
        return next.handle().pipe((0, operators_1.tap)({
            next: (responseBody) => {
                const endTime = Date.now();
                const duration = endTime - startTime;
                this.logResponse(request, response, responseBody, duration, correlationId);
            },
            error: (error) => {
                const endTime = Date.now();
                const duration = endTime - startTime;
                this.logError(request, response, error, duration, correlationId);
            },
        }));
    }
    logRequest(request, correlationId) {
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
    logResponse(request, response, responseBody, duration, correlationId) {
        const { method, url } = request;
        const { statusCode } = response;
        const logLevel = statusCode >= 400 ? 'error' : statusCode >= 300 ? 'warn' : 'log';
        const isSlowRequest = duration > 1000;
        this.logger[logLevel](`${method} ${url} - ${statusCode} in ${duration}ms${isSlowRequest ? ' (SLOW)' : ''}`, {
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
        });
        if (isSlowRequest && statusCode < 400) {
            this.logger.warn(`Slow request detected: ${method} ${url} took ${duration}ms`, {
                type: 'SLOW_REQUEST',
                correlationId,
                duration,
                threshold: 1000,
            });
        }
    }
    logError(request, _response, error, duration, correlationId) {
        const { method, url } = request;
        const statusCode = error.status || error.statusCode || 500;
        this.logger.error(`${method} ${url} - ERROR ${statusCode} in ${duration}ms: ${error.message}`, {
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
        });
    }
};
exports.LoggingInterceptor = LoggingInterceptor;
exports.LoggingInterceptor = LoggingInterceptor = LoggingInterceptor_1 = __decorate([
    (0, common_1.Injectable)()
], LoggingInterceptor);
//# sourceMappingURL=logging.interceptor.js.map