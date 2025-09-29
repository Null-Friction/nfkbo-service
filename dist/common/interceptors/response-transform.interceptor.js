"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResponseTransformInterceptor = void 0;
const common_1 = require("@nestjs/common");
const operators_1 = require("rxjs/operators");
let ResponseTransformInterceptor = class ResponseTransformInterceptor {
    intercept(context, next) {
        const request = context.switchToHttp().getRequest();
        const correlationId = request.headers['x-correlation-id'];
        const startTime = Date.now();
        return next.handle().pipe((0, operators_1.map)((data) => {
            const endTime = Date.now();
            const responseTime = endTime - startTime;
            if (data && typeof data === 'object' && 'success' in data && 'meta' in data) {
                return data;
            }
            if (data === null || data === undefined) {
                return {
                    success: true,
                    data: null,
                    meta: {
                        timestamp: new Date().toISOString(),
                        requestId: correlationId,
                        responseTime,
                    },
                };
            }
            return {
                success: true,
                data,
                meta: {
                    timestamp: new Date().toISOString(),
                    requestId: correlationId,
                    responseTime,
                },
            };
        }));
    }
};
exports.ResponseTransformInterceptor = ResponseTransformInterceptor;
exports.ResponseTransformInterceptor = ResponseTransformInterceptor = __decorate([
    (0, common_1.Injectable)()
], ResponseTransformInterceptor);
//# sourceMappingURL=response-transform.interceptor.js.map