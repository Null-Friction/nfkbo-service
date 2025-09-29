import { Test, TestingModule } from '@nestjs/testing';
import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ApiKeyGuard } from './api-key.guard';
import { ApiKeyService } from '../services/api-key.service';
import { ApiKeyRole } from '../entities/api-key.entity';

describe('ApiKeyGuard', () => {
  let guard: ApiKeyGuard;
  let apiKeyService: ApiKeyService;
  let reflector: Reflector;

  const mockApiKeyService = {
    validateApiKey: jest.fn(),
  };

  const mockReflector = {
    getAllAndOverride: jest.fn(),
  };

  const createMockExecutionContext = (headers: any = {}): ExecutionContext => {
    return {
      switchToHttp: () => ({
        getRequest: () => ({
          headers,
        }),
      }),
      getHandler: jest.fn(),
      getClass: jest.fn(),
    } as any;
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ApiKeyGuard,
        {
          provide: ApiKeyService,
          useValue: mockApiKeyService,
        },
        {
          provide: Reflector,
          useValue: mockReflector,
        },
      ],
    }).compile();

    guard = module.get<ApiKeyGuard>(ApiKeyGuard);
    apiKeyService = module.get<ApiKeyService>(ApiKeyService);
    reflector = module.get<Reflector>(Reflector);

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

    await expect(guard.canActivate(context)).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('should throw UnauthorizedException when API key is invalid', async () => {
    mockReflector.getAllAndOverride.mockReturnValue(false);
    mockApiKeyService.validateApiKey.mockResolvedValue(null);
    const context = createMockExecutionContext({
      'x-api-key': 'invalid-key',
    });

    await expect(guard.canActivate(context)).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('should allow access with valid API key', async () => {
    const mockApiKey = {
      id: '1',
      name: 'Test Key',
      role: ApiKeyRole.USER,
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
      role: ApiKeyRole.USER,
      isActive: true,
      rateLimit: 100,
    };

    mockReflector.getAllAndOverride
      .mockReturnValueOnce(false) // isPublic
      .mockReturnValueOnce([ApiKeyRole.ADMIN]); // requiredRoles

    mockApiKeyService.validateApiKey.mockResolvedValue(mockApiKey);
    const context = createMockExecutionContext({
      'x-api-key': 'valid-key',
    });

    await expect(guard.canActivate(context)).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('should allow access when user has required role', async () => {
    const mockApiKey = {
      id: '1',
      name: 'Test Key',
      role: ApiKeyRole.ADMIN,
      isActive: true,
      rateLimit: 100,
    };

    mockReflector.getAllAndOverride
      .mockReturnValueOnce(false) // isPublic
      .mockReturnValueOnce([ApiKeyRole.ADMIN, ApiKeyRole.USER]); // requiredRoles

    mockApiKeyService.validateApiKey.mockResolvedValue(mockApiKey);
    const context = createMockExecutionContext({
      'x-api-key': 'valid-key',
    });

    const result = await guard.canActivate(context);

    expect(result).toBe(true);
  });
});