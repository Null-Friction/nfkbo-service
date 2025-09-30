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
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const api_key_service_1 = require("./services/api-key.service");
const create_api_key_dto_1 = require("./dto/create-api-key.dto");
const api_key_guard_1 = require("./guards/api-key.guard");
const roles_decorator_1 = require("./decorators/roles.decorator");
const api_key_entity_1 = require("./entities/api-key.entity");
let AuthController = class AuthController {
    constructor(apiKeyService) {
        this.apiKeyService = apiKeyService;
    }
    async create(createApiKeyDto) {
        return this.apiKeyService.createApiKey(createApiKeyDto);
    }
    async findAll() {
        return this.apiKeyService.findAll();
    }
    async findOne(id) {
        return this.apiKeyService.findOne(id);
    }
    async revoke(id) {
        await this.apiKeyService.revokeApiKey(id);
        return { message: 'API key revoked successfully' };
    }
    async delete(id) {
        await this.apiKeyService.deleteApiKey(id);
        return { message: 'API key deleted successfully' };
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(api_key_entity_1.ApiKeyRole.ADMIN),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_api_key_dto_1.CreateApiKeyDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)(api_key_entity_1.ApiKeyRole.ADMIN),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, roles_decorator_1.Roles)(api_key_entity_1.ApiKeyRole.ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "findOne", null);
__decorate([
    (0, common_1.Delete)(':id/revoke'),
    (0, roles_decorator_1.Roles)(api_key_entity_1.ApiKeyRole.ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "revoke", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)(api_key_entity_1.ApiKeyRole.ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "delete", null);
exports.AuthController = AuthController = __decorate([
    (0, common_1.Controller)('auth/api-keys'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard),
    __metadata("design:paramtypes", [api_key_service_1.ApiKeyService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map