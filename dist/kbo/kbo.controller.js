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
exports.KboController = void 0;
const common_1 = require("@nestjs/common");
const dto_1 = require("./dto");
const kbo_service_1 = require("./kbo.service");
let KboController = class KboController {
    constructor(kboService) {
        this.kboService = kboService;
    }
    async searchByNumber(params) {
        return this.kboService.searchByNumber(params.number);
    }
    async searchByName(query) {
        return this.kboService.searchByName(query.name);
    }
    async getEnterprise(params) {
        return this.kboService.getEnterprise(params.enterpriseNumber);
    }
    async getEstablishment(params) {
        return this.kboService.getEstablishment(params.establishmentNumber);
    }
    async searchEnterprises(params) {
        return this.kboService.searchEnterprises(params);
    }
    async searchEstablishments(params) {
        return this.kboService.searchEstablishments(params);
    }
};
exports.KboController = KboController;
__decorate([
    (0, common_1.Get)('companies/search/number/:number'),
    __param(0, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.SearchByNumberDto]),
    __metadata("design:returntype", Promise)
], KboController.prototype, "searchByNumber", null);
__decorate([
    (0, common_1.Get)('companies/search/name'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.SearchByNameDto]),
    __metadata("design:returntype", Promise)
], KboController.prototype, "searchByName", null);
__decorate([
    (0, common_1.Get)('enterprises/:enterpriseNumber'),
    __param(0, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.GetEnterpriseDto]),
    __metadata("design:returntype", Promise)
], KboController.prototype, "getEnterprise", null);
__decorate([
    (0, common_1.Get)('establishments/:establishmentNumber'),
    __param(0, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.SearchByEstablishmentNumberDto]),
    __metadata("design:returntype", Promise)
], KboController.prototype, "getEstablishment", null);
__decorate([
    (0, common_1.Get)('enterprises'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.EnterpriseSearchDto]),
    __metadata("design:returntype", Promise)
], KboController.prototype, "searchEnterprises", null);
__decorate([
    (0, common_1.Get)('establishments'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.EstablishmentSearchDto]),
    __metadata("design:returntype", Promise)
], KboController.prototype, "searchEstablishments", null);
exports.KboController = KboController = __decorate([
    (0, common_1.Controller)('kbo'),
    __metadata("design:paramtypes", [kbo_service_1.KboService])
], KboController);
//# sourceMappingURL=kbo.controller.js.map