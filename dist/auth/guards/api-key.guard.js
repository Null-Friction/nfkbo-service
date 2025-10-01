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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiKeyGuard = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const public_decorator_1 = require("../decorators/public.decorator");
const roles_decorator_1 = require("../decorators/roles.decorator");
const api_key_service_1 = require("../services/api-key.service");
let ApiKeyGuard = class ApiKeyGuard {
    constructor(apiKeyService, reflector) {
        this.apiKeyService = apiKeyService;
        this.reflector = reflector;
    }
    async canActivate(context) {
        const isPublic = this.reflector.getAllAndOverride(public_decorator_1.IS_PUBLIC_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        if (isPublic) {
            return true;
        }
        const request = context.switchToHttp().getRequest();
        const apiKey = this.extractApiKeyFromHeader(request);
        if (!apiKey) {
            throw new common_1.UnauthorizedException('API key is missing');
        }
        const ipAddress = this.extractIpAddress(request);
        const validatedKey = await this.apiKeyService.validateApiKey(apiKey, ipAddress);
        if (!validatedKey) {
            throw new common_1.UnauthorizedException('Invalid API key');
        }
        const requiredRoles = this.reflector.getAllAndOverride(roles_decorator_1.ROLES_KEY, [context.getHandler(), context.getClass()]);
        if (requiredRoles) {
            const hasRole = requiredRoles.includes(validatedKey.role);
            if (!hasRole) {
                throw new common_1.UnauthorizedException('Insufficient permissions for this operation');
            }
        }
        request.apiKey = validatedKey;
        return true;
    }
    extractApiKeyFromHeader(request) {
        const authHeader = request.headers['x-api-key'];
        return authHeader || undefined;
    }
    extractIpAddress(request) {
        const forwarded = request.headers['x-forwarded-for'];
        if (forwarded) {
            return forwarded.split(',')[0].trim();
        }
        const realIp = request.headers['x-real-ip'];
        if (realIp) {
            return realIp;
        }
        return request.ip || request.connection?.remoteAddress;
    }
};
exports.ApiKeyGuard = ApiKeyGuard;
exports.ApiKeyGuard = ApiKeyGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [api_key_service_1.ApiKeyService,
        core_1.Reflector])
], ApiKeyGuard);
//# sourceMappingURL=api-key.guard.js.map