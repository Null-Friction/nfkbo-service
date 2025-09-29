import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { ApiKeyService } from './api-key.service';
import { ApiKeyRole } from '../entities/api-key.entity';

describe('ApiKeyService', () => {
  let service: ApiKeyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ApiKeyService],
    }).compile();

    service = module.get<ApiKeyService>(ApiKeyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createApiKey', () => {
    it('should create an API key successfully', async () => {
      const createDto = {
        name: 'Test API Key',
        role: ApiKeyRole.USER,
        rateLimit: 100,
      };

      const result = await service.createApiKey(createDto);

      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('key');
      expect(result.key).toMatch(/^nfkbo_/);
      expect(result.name).toBe(createDto.name);
      expect(result.role).toBe(createDto.role);
      expect(result.rateLimit).toBe(createDto.rateLimit);
      expect(result.isActive).toBe(true);
    });

    it('should create an API key with default rate limit', async () => {
      const createDto = {
        name: 'Test API Key',
        role: ApiKeyRole.USER,
      };

      const result = await service.createApiKey(createDto);

      expect(result.rateLimit).toBe(100);
    });
  });

  describe('validateApiKey', () => {
    it('should validate a correct API key', async () => {
      const createDto = {
        name: 'Test API Key',
        role: ApiKeyRole.USER,
        rateLimit: 100,
      };

      const created = await service.createApiKey(createDto);
      const validated = await service.validateApiKey(created.key);

      expect(validated).toBeDefined();
      expect(validated?.id).toBe(created.id);
      expect(validated?.name).toBe(created.name);
    });

    it('should return null for invalid API key', async () => {
      const validated = await service.validateApiKey('invalid_key');

      expect(validated).toBeNull();
    });

    it('should update lastUsedAt on successful validation', async () => {
      const createDto = {
        name: 'Test API Key',
        role: ApiKeyRole.USER,
        rateLimit: 100,
      };

      const created = await service.createApiKey(createDto);
      expect(created).not.toHaveProperty('lastUsedAt');

      const validated = await service.validateApiKey(created.key);

      expect(validated?.lastUsedAt).toBeDefined();
    });

    it('should return null for revoked API key', async () => {
      const createDto = {
        name: 'Test API Key',
        role: ApiKeyRole.USER,
        rateLimit: 100,
      };

      const created = await service.createApiKey(createDto);
      await service.revokeApiKey(created.id);

      const validated = await service.validateApiKey(created.key);

      expect(validated).toBeNull();
    });
  });

  describe('findAll', () => {
    it('should return all API keys', async () => {
      const createDto1 = {
        name: 'Test API Key 1',
        role: ApiKeyRole.USER,
        rateLimit: 100,
      };
      const createDto2 = {
        name: 'Test API Key 2',
        role: ApiKeyRole.ADMIN,
        rateLimit: 200,
      };

      await service.createApiKey(createDto1);
      await service.createApiKey(createDto2);

      const result = await service.findAll();

      expect(result).toHaveLength(2);
      expect(result[0]).not.toHaveProperty('key');
      expect(result[0]).not.toHaveProperty('hashedKey');
    });
  });

  describe('findOne', () => {
    it('should return an API key by ID', async () => {
      const createDto = {
        name: 'Test API Key',
        role: ApiKeyRole.USER,
        rateLimit: 100,
      };

      const created = await service.createApiKey(createDto);
      const found = await service.findOne(created.id);

      expect(found.id).toBe(created.id);
      expect(found.name).toBe(created.name);
    });

    it('should throw NotFoundException for non-existent ID', async () => {
      await expect(service.findOne('non-existent-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('revokeApiKey', () => {
    it('should revoke an API key', async () => {
      const createDto = {
        name: 'Test API Key',
        role: ApiKeyRole.USER,
        rateLimit: 100,
      };

      const created = await service.createApiKey(createDto);
      await service.revokeApiKey(created.id);

      const found = await service.findOne(created.id);
      expect(found.isActive).toBe(false);
    });

    it('should throw NotFoundException for non-existent ID', async () => {
      await expect(service.revokeApiKey('non-existent-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('deleteApiKey', () => {
    it('should delete an API key', async () => {
      const createDto = {
        name: 'Test API Key',
        role: ApiKeyRole.USER,
        rateLimit: 100,
      };

      const created = await service.createApiKey(createDto);
      await service.deleteApiKey(created.id);

      await expect(service.findOne(created.id)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw NotFoundException for non-existent ID', async () => {
      await expect(service.deleteApiKey('non-existent-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});