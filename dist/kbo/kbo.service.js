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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.KboService = void 0;
const common_1 = require("@nestjs/common");
const tokens_1 = require("./tokens");
let KboService = class KboService {
    constructor(provider) {
        this.provider = provider;
    }
    async searchByNumber(number) {
        return this.provider.searchByNumber(number);
    }
    async searchByName(name) {
        return this.provider.searchByName(name);
    }
    async getEnterprise(enterpriseNumber) {
        return this.provider.getEnterprise(enterpriseNumber);
    }
    async getEstablishment(establishmentNumber) {
        return this.provider.getEstablishment(establishmentNumber);
    }
    async searchEnterprises(params) {
        return this.provider.searchEnterprises(params);
    }
    async searchEstablishments(params) {
        return this.provider.searchEstablishments(params);
    }
};
exports.KboService = KboService;
exports.KboService = KboService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(tokens_1.KBO_PROVIDER_TOKEN)),
    __metadata("design:paramtypes", [Object])
], KboService);
//# sourceMappingURL=kbo.service.js.map