"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var KboExceptionFilter_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.KboExceptionFilter = void 0;
const common_1 = require("@nestjs/common");
const errors_1 = require("../providers/errors");
let KboExceptionFilter = KboExceptionFilter_1 = class KboExceptionFilter {
    constructor() {
        this.logger = new common_1.Logger(KboExceptionFilter_1.name);
    }
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();
        const status = this.getHttpStatus(exception);
        const correlationId = request.headers['x-correlation-id'];
        const errorResponse = {
            statusCode: status,
            message: exception.message,
            error: exception.name,
            code: exception.code,
            timestamp: new Date().toISOString(),
            path: request.url,
            ...(correlationId && { correlationId }),
            ...(exception.details && { details: exception.details }),
        };
        this.logKboError(exception, request, correlationId);
        response.status(status).json(errorResponse);
    }
    getHttpStatus(exception) {
        if (exception.statusCode) {
            return exception.statusCode;
        }
        if (exception instanceof errors_1.KBONotFoundError) {
            return common_1.HttpStatus.NOT_FOUND;
        }
        if (exception instanceof errors_1.KBOValidationError) {
            return common_1.HttpStatus.BAD_REQUEST;
        }
        if (exception instanceof errors_1.KBORateLimitError) {
            return common_1.HttpStatus.TOO_MANY_REQUESTS;
        }
        if (exception instanceof errors_1.KBOAuthenticationError) {
            return common_1.HttpStatus.UNAUTHORIZED;
        }
        if (exception instanceof errors_1.KBONetworkError) {
            return common_1.HttpStatus.BAD_GATEWAY;
        }
        if (exception instanceof errors_1.KBOConfigurationError) {
            return common_1.HttpStatus.INTERNAL_SERVER_ERROR;
        }
        return common_1.HttpStatus.INTERNAL_SERVER_ERROR;
    }
    logKboError(exception, request, correlationId) {
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
        if (exception instanceof errors_1.KBONotFoundError) {
            this.logger.warn(logMessage, context);
        }
        else if (exception instanceof errors_1.KBOValidationError) {
            this.logger.warn(logMessage, context);
        }
        else if (exception instanceof errors_1.KBORateLimitError) {
            this.logger.warn(logMessage, context);
        }
        else if (exception instanceof errors_1.KBOAuthenticationError) {
            this.logger.error(logMessage, context);
        }
        else if (exception instanceof errors_1.KBONetworkError) {
            this.logger.error(logMessage, context);
        }
        else if (exception instanceof errors_1.KBOConfigurationError) {
            this.logger.error(logMessage, context);
        }
        else {
            this.logger.error(logMessage, context);
        }
    }
};
exports.KboExceptionFilter = KboExceptionFilter;
exports.KboExceptionFilter = KboExceptionFilter = KboExceptionFilter_1 = __decorate([
    (0, common_1.Catch)(errors_1.KBOProviderError)
], KboExceptionFilter);
//# sourceMappingURL=kbo-exception.filter.js.map