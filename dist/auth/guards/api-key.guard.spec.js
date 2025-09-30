"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const config_1 = require("@nestjs/config");
const api_key_guard_1 = require("./api-key.guard");
const api_key_service_1 = require("../services/api-key.service");
const api_key_entity_1 = require("../entities/api-key.entity");
describe('ApiKeyGuard', () => {
    let guard;
    let apiKeyService;
    let reflector;
    const mockApiKeyService = {
        validateApiKey: jest.fn(),
    };
    const mockReflector = {
        getAllAndOverride: jest.fn(),
    };
    const mockConfigService = {
        get: jest.fn(),
    };
    const createMockExecutionContext = (headers = {}) => {
        return {
            switchToHttp: () => ({
                getRequest: () => ({
                    headers,
                }),
            }),
            getHandler: jest.fn(),
            getClass: jest.fn(),
        };
    };
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            providers: [
                api_key_guard_1.ApiKeyGuard,
                {
                    provide: api_key_service_1.ApiKeyService,
                    useValue: mockApiKeyService,
                },
                {
                    provide: core_1.Reflector,
                    useValue: mockReflector,
                },
                {
                    provide: config_1.ConfigService,
                    useValue: mockConfigService,
                },
            ],
        }).compile();
        guard = module.get(api_key_guard_1.ApiKeyGuard);
        apiKeyService = module.get(api_key_service_1.ApiKeyService);
        reflector = module.get(core_1.Reflector);
        jest.clearAllMocks();
    });
    it('should be defined', () => {
        expect(guard).toBeDefined();
    });
    it('should allow access to public endpoints', async () => {
        mockReflector.getAllAndOverride.mockReturnValue(true);
        const context = createMockExecutionContext();
        const result = await guard.canActivate(context);
        expect(result).toBe(true);
        expect(mockApiKeyService.validateApiKey).not.toHaveBeenCalled();
    });
    it('should throw UnauthorizedException when API key is missing', async () => {
        mockReflector.getAllAndOverride.mockReturnValue(false);
        const context = createMockExecutionContext();
        await expect(guard.canActivate(context)).rejects.toThrow(common_1.UnauthorizedException);
    });
    it('should throw UnauthorizedException when API key is invalid', async () => {
        mockReflector.getAllAndOverride.mockReturnValue(false);
        mockApiKeyService.validateApiKey.mockResolvedValue(null);
        const context = createMockExecutionContext({
            'x-api-key': 'invalid-key',
        });
        await expect(guard.canActivate(context)).rejects.toThrow(common_1.UnauthorizedException);
    });
    it('should allow access with valid API key', async () => {
        const mockApiKey = {
            id: '1',
            name: 'Test Key',
            role: api_key_entity_1.ApiKeyRole.USER,
            isActive: true,
            rateLimit: 100,
        };
        mockReflector.getAllAndOverride.mockReturnValue(false);
        mockApiKeyService.validateApiKey.mockResolvedValue(mockApiKey);
        const context = createMockExecutionContext({
            'x-api-key': 'valid-key',
        });
        const result = await guard.canActivate(context);
        expect(result).toBe(true);
    });
    it('should enforce role-based access control', async () => {
        const mockApiKey = {
            id: '1',
            name: 'Test Key',
            role: api_key_entity_1.ApiKeyRole.USER,
            isActive: true,
            rateLimit: 100,
        };
        mockReflector.getAllAndOverride
            .mockReturnValueOnce(false)
            .mockReturnValueOnce([api_key_entity_1.ApiKeyRole.ADMIN]);
        mockApiKeyService.validateApiKey.mockResolvedValue(mockApiKey);
        const context = createMockExecutionContext({
            'x-api-key': 'valid-key',
        });
        await expect(guard.canActivate(context)).rejects.toThrow(common_1.UnauthorizedException);
    });
    it('should allow access when user has required role', async () => {
        const mockApiKey = {
            id: '1',
            name: 'Test Key',
            role: api_key_entity_1.ApiKeyRole.ADMIN,
            isActive: true,
            rateLimit: 100,
        };
        mockReflector.getAllAndOverride
            .mockReturnValueOnce(false)
            .mockReturnValueOnce([api_key_entity_1.ApiKeyRole.ADMIN, api_key_entity_1.ApiKeyRole.USER]);
        mockApiKeyService.validateApiKey.mockResolvedValue(mockApiKey);
        const context = createMockExecutionContext({
            'x-api-key': 'valid-key',
        });
        const result = await guard.canActivate(context);
        expect(result).toBe(true);
    });
});
//# sourceMappingURL=api-key.guard.spec.js.map