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
exports.KboProviderHealthIndicator = void 0;
const common_1 = require("@nestjs/common");
const terminus_1 = require("@nestjs/terminus");
const config_service_1 = require("../../config/config.service");
let KboProviderHealthIndicator = class KboProviderHealthIndicator extends terminus_1.HealthIndicator {
    constructor(configService) {
        super();
        this.configService = configService;
    }
    async isHealthy(key) {
        const isHealthy = await this.checkKboProviderHealth();
        const result = this.getStatus(key, isHealthy, {
            baseUrl: this.configService.kboApiBaseUrl,
            useRealProvider: this.configService.useRealKboProvider,
            timeout: this.configService.kboApiTimeout,
        });
        if (isHealthy) {
            return result;
        }
        throw new terminus_1.HealthCheckError('KBO Provider Health Check Failed', result);
    }
    async checkKboProviderHealth() {
        try {
            if (!this.configService.useRealKboProvider) {
                return true;
            }
            const hasValidConfig = this.validateKboConfiguration();
            return hasValidConfig;
        }
        catch {
            return false;
        }
    }
    validateKboConfiguration() {
        const baseUrl = this.configService.kboApiBaseUrl;
        if (!baseUrl || !this.isValidUrl(baseUrl)) {
            return false;
        }
        const timeout = this.configService.kboApiTimeout;
        if (timeout <= 0 || timeout > 60000) {
            return false;
        }
        return true;
    }
    isValidUrl(urlString) {
        try {
            const url = new URL(urlString);
            return url.protocol === 'http:' || url.protocol === 'https:';
        }
        catch {
            return false;
        }
    }
};
exports.KboProviderHealthIndicator = KboProviderHealthIndicator;
exports.KboProviderHealthIndicator = KboProviderHealthIndicator = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_service_1.AppConfigService])
], KboProviderHealthIndicator);
//# sourceMappingURL=kbo-provider.health.js.map