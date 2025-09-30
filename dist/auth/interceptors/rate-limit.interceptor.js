"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var RateLimitInterceptor_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RateLimitInterceptor = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
let RateLimitInterceptor = RateLimitInterceptor_1 = class RateLimitInterceptor {
    constructor(configService) {
        this.configService = configService;
        this.logger = new common_1.Logger(RateLimitInterceptor_1.name);
        this.rateLimitStore = new Map();
        this.windowMs = this.configService.get('auth.rateLimitWindowMs', 60000);
        this.cleanupInterval = setInterval(() => {
            this.cleanupStaleEntries();
        }, 5 * 60 * 1000);
    }
    intercept(context, next) {
        const request = context.switchToHttp().getRequest();
        const response = context.switchToHttp().getResponse();
        const apiKey = request.apiKey;
        if (!apiKey) {
            return next.handle();
        }
        const now = Date.now();
        const keyId = apiKey.id;
        const limit = apiKey.rateLimit;
        let record = this.rateLimitStore.get(keyId);
        if (!record || now > record.resetTime) {
            record = {
                count: 0,
                resetTime: now + this.windowMs,
            };
            this.rateLimitStore.set(keyId, record);
        }
        if (record.count >= limit) {
            throw new common_1.HttpException({
                statusCode: common_1.HttpStatus.TOO_MANY_REQUESTS,
                message: 'Rate limit exceeded',
                retryAfter: new Date(record.resetTime).toISOString(),
            }, common_1.HttpStatus.TOO_MANY_REQUESTS);
        }
        record.count++;
        response.setHeader('X-RateLimit-Limit', limit.toString());
        response.setHeader('X-RateLimit-Remaining', Math.max(0, limit - record.count).toString());
        response.setHeader('X-RateLimit-Reset', new Date(record.resetTime).toISOString());
        return next.handle();
    }
    cleanupStaleEntries() {
        const now = Date.now();
        let cleanedCount = 0;
        for (const [keyId, record] of this.rateLimitStore.entries()) {
            if (now > record.resetTime + 3600000) {
                this.rateLimitStore.delete(keyId);
                cleanedCount++;
            }
        }
        if (cleanedCount > 0) {
            this.logger.log(`Cleaned up ${cleanedCount} stale rate limit entries. Current size: ${this.rateLimitStore.size}`);
        }
    }
    onModuleDestroy() {
        if (this.cleanupInterval) {
            clearInterval(this.cleanupInterval);
        }
    }
};
exports.RateLimitInterceptor = RateLimitInterceptor;
exports.RateLimitInterceptor = RateLimitInterceptor = RateLimitInterceptor_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], RateLimitInterceptor);
//# sourceMappingURL=rate-limit.interceptor.js.map