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
var HealthController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.HealthController = void 0;
const common_1 = require("@nestjs/common");
const terminus_1 = require("@nestjs/terminus");
const kbo_provider_health_1 = require("./indicators/kbo-provider.health");
const memory_health_1 = require("./indicators/memory.health");
const public_decorator_1 = require("../auth/decorators/public.decorator");
let HealthController = HealthController_1 = class HealthController {
    constructor(health, http, kboProvider, memory) {
        this.health = health;
        this.http = http;
        this.kboProvider = kboProvider;
        this.memory = memory;
        this.logger = new common_1.Logger(HealthController_1.name);
    }
    async check() {
        this.logger.log('Performing comprehensive health check');
        return this.health.check([
            () => this.http.pingCheck('nestjs-service', 'https://nestjs.com'),
            () => this.kboProvider.isHealthy('kbo-provider'),
            () => this.memory.isHealthy('memory'),
        ]);
    }
    async checkLiveness() {
        this.logger.log('Performing liveness probe check');
        return this.health.check([
            () => this.memory.isHealthy('memory'),
        ]);
    }
    async checkReadiness() {
        this.logger.log('Performing readiness probe check');
        return this.health.check([
            () => this.kboProvider.isHealthy('kbo-provider'),
            () => this.memory.isHealthy('memory'),
        ]);
    }
};
exports.HealthController = HealthController;
__decorate([
    (0, common_1.Get)(),
    (0, terminus_1.HealthCheck)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], HealthController.prototype, "check", null);
__decorate([
    (0, common_1.Get)('live'),
    (0, terminus_1.HealthCheck)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], HealthController.prototype, "checkLiveness", null);
__decorate([
    (0, common_1.Get)('ready'),
    (0, terminus_1.HealthCheck)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], HealthController.prototype, "checkReadiness", null);
exports.HealthController = HealthController = HealthController_1 = __decorate([
    (0, common_1.Controller)('health'),
    (0, public_decorator_1.Public)(),
    __metadata("design:paramtypes", [terminus_1.HealthCheckService,
        terminus_1.HttpHealthIndicator,
        kbo_provider_health_1.KboProviderHealthIndicator,
        memory_health_1.MemoryHealthIndicator])
], HealthController);
//# sourceMappingURL=health.controller.js.map