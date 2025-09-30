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
var ApiKeyService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiKeyService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const crypto_1 = require("crypto");
const bcrypt = require("bcrypt");
const config_1 = require("@nestjs/config");
const api_key_db_entity_1 = require("../entities/api-key-db.entity");
const api_key_entity_1 = require("../entities/api-key.entity");
let ApiKeyService = ApiKeyService_1 = class ApiKeyService {
    constructor(apiKeyRepository, configService) {
        this.apiKeyRepository = apiKeyRepository;
        this.configService = configService;
        this.logger = new common_1.Logger(ApiKeyService_1.name);
        this.bootstrapKey = null;
    }
    async onModuleInit() {
        const bootstrapApiKey = this.configService.get('auth.bootstrapApiKey');
        if (bootstrapApiKey) {
            this.logger.warn('Bootstrap API key detected - this key is ephemeral and should only be used to create the first admin key');
            const hashedKey = await bcrypt.hash(bootstrapApiKey, 10);
            this.bootstrapKey = {
                key: bootstrapApiKey,
                hashedKey,
            };
        }
        const adminCount = await this.apiKeyRepository.count({
            where: { role: api_key_entity_1.ApiKeyRole.ADMIN, isActive: true },
        });
        if (adminCount === 0 && !this.bootstrapKey) {
            this.logger.error('CRITICAL: No admin API keys exist and no bootstrap key provided. Set BOOTSTRAP_API_KEY environment variable.');
        }
    }
    async createApiKey(createDto, createdBy) {
        const key = this.generateApiKey();
        const hashedKey = await bcrypt.hash(key, 10);
        const hashPrefix = hashedKey.substring(0, 16);
        const apiKeyEntity = this.apiKeyRepository.create({
            hashPrefix,
            hashedKey,
            name: createDto.name,
            role: createDto.role,
            isActive: true,
            expiresAt: createDto.expiresAt ? new Date(createDto.expiresAt) : null,
            rateLimit: createDto.rateLimit || 100,
            requestCount: BigInt(0),
            createdBy,
            lastUsedAt: null,
            lastUsedIp: null,
        });
        const savedKey = await this.apiKeyRepository.save(apiKeyEntity);
        this.logger.log(`API key created: ${savedKey.id} (${savedKey.name}) with role ${savedKey.role}${createdBy ? ` by ${createdBy}` : ''}`);
        return {
            id: savedKey.id,
            key,
            name: savedKey.name,
            role: savedKey.role,
            isActive: savedKey.isActive,
            createdAt: savedKey.createdAt,
            expiresAt: savedKey.expiresAt,
            rateLimit: savedKey.rateLimit,
            requestCount: Number(savedKey.requestCount),
        };
    }
    async validateApiKey(key, ipAddress) {
        if (this.bootstrapKey) {
            const isBootstrapMatch = await bcrypt.compare(key, this.bootstrapKey.hashedKey);
            if (isBootstrapMatch) {
                this.logger.warn('Bootstrap API key used - create a proper admin key');
                return {
                    id: 'bootstrap',
                    key: this.bootstrapKey.key,
                    hashedKey: this.bootstrapKey.hashedKey,
                    name: 'Bootstrap Key',
                    role: api_key_entity_1.ApiKeyRole.ADMIN,
                    isActive: true,
                    createdAt: new Date(),
                    rateLimit: 1000,
                    requestCount: 0,
                };
            }
        }
        const hashedInput = await bcrypt.hash(key, 10);
        const hashPrefix = hashedInput.substring(0, 16);
        const candidates = await this.apiKeyRepository.find({
            where: { isActive: true },
            take: 100,
        });
        let matchedKey = null;
        for (const candidate of candidates) {
            const isMatch = await bcrypt.compare(key, candidate.hashedKey);
            if (isMatch && !matchedKey) {
                matchedKey = candidate;
            }
        }
        if (!matchedKey) {
            return null;
        }
        if (matchedKey.expiresAt && new Date() > matchedKey.expiresAt) {
            matchedKey.isActive = false;
            await this.apiKeyRepository.save(matchedKey);
            this.logger.warn(`API key expired: ${matchedKey.id} (${matchedKey.name})`);
            return null;
        }
        matchedKey.lastUsedAt = new Date();
        matchedKey.requestCount = BigInt(Number(matchedKey.requestCount) + 1);
        if (ipAddress) {
            matchedKey.lastUsedIp = ipAddress;
        }
        this.apiKeyRepository.save(matchedKey).catch((err) => {
            this.logger.error(`Failed to update API key usage stats: ${err.message}`);
        });
        return {
            id: matchedKey.id,
            key: '',
            hashedKey: matchedKey.hashedKey,
            name: matchedKey.name,
            role: matchedKey.role,
            isActive: matchedKey.isActive,
            createdAt: matchedKey.createdAt,
            lastUsedAt: matchedKey.lastUsedAt,
            expiresAt: matchedKey.expiresAt,
            rateLimit: matchedKey.rateLimit,
            requestCount: Number(matchedKey.requestCount),
        };
    }
    async findAll() {
        const keys = await this.apiKeyRepository.find({
            order: { createdAt: 'DESC' },
        });
        return keys.map((key) => ({
            id: key.id,
            name: key.name,
            role: key.role,
            isActive: key.isActive,
            createdAt: key.createdAt,
            lastUsedAt: key.lastUsedAt,
            expiresAt: key.expiresAt,
            rateLimit: key.rateLimit,
            requestCount: Number(key.requestCount),
        }));
    }
    async findOne(id) {
        const apiKey = await this.apiKeyRepository.findOne({ where: { id } });
        if (!apiKey) {
            throw new common_1.NotFoundException(`API Key with ID ${id} not found`);
        }
        return {
            id: apiKey.id,
            name: apiKey.name,
            role: apiKey.role,
            isActive: apiKey.isActive,
            createdAt: apiKey.createdAt,
            lastUsedAt: apiKey.lastUsedAt,
            expiresAt: apiKey.expiresAt,
            rateLimit: apiKey.rateLimit,
            requestCount: Number(apiKey.requestCount),
        };
    }
    async revokeApiKey(id, revokedBy) {
        const apiKey = await this.apiKeyRepository.findOne({ where: { id } });
        if (!apiKey) {
            throw new common_1.NotFoundException(`API Key with ID ${id} not found`);
        }
        apiKey.isActive = false;
        await this.apiKeyRepository.save(apiKey);
        this.logger.log(`API key revoked: ${apiKey.id} (${apiKey.name})${revokedBy ? ` by ${revokedBy}` : ''}`);
    }
    async deleteApiKey(id, deletedBy) {
        const apiKey = await this.apiKeyRepository.findOne({ where: { id } });
        if (!apiKey) {
            throw new common_1.NotFoundException(`API Key with ID ${id} not found`);
        }
        await this.apiKeyRepository.remove(apiKey);
        this.logger.log(`API key deleted: ${id} (${apiKey.name})${deletedBy ? ` by ${deletedBy}` : ''}`);
    }
    generateApiKey() {
        return `nfkbo_${(0, crypto_1.randomBytes)(32).toString('hex')}`;
    }
};
exports.ApiKeyService = ApiKeyService;
exports.ApiKeyService = ApiKeyService = ApiKeyService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(api_key_db_entity_1.ApiKeyEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        config_1.ConfigService])
], ApiKeyService);
//# sourceMappingURL=api-key.service.js.map