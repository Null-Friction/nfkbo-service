import { NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ApiKeyEntity } from '../entities/api-key-db.entity';
import { ApiKeyRole } from '../entities/api-key.entity';
import { ApiKeyService } from './api-key.service';

describe('ApiKeyService', () => {
  let service: ApiKeyService;

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
    count: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn((key: string) => {
      if (key === 'auth.bootstrapApiKey') return undefined;
      if (key === 'auth.rateLimitWindowMs') return 60000;
      return null;
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ApiKeyService,
        {
          provide: getRepositoryToken(ApiKeyEntity),
          useValue: mockRepository,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    service = module.get<ApiKeyService>(ApiKeyService);

    jest.clearAllMocks();
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

      const mockEntity = {
        id: 'test-uuid',
        hashPrefix: 'abcdef1234567890',
        hashedKey: '$2b$10$hashedvalue',
        name: createDto.name,
        role: createDto.role,
        isActive: true,
        createdAt: new Date(),
        rateLimit: 100,
        requestCount: BigInt(0),
      };

      mockRepository.create.mockReturnValue(mockEntity);
      mockRepository.save.mockResolvedValue(mockEntity);

      const result = await service.createApiKey(createDto);

      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('key');
      expect(result.key).toMatch(/^nfkbo_/);
      expect(result.name).toBe(createDto.name);
      expect(result.role).toBe(createDto.role);
      expect(result.rateLimit).toBe(createDto.rateLimit);
      expect(result.isActive).toBe(true);
    });
  });

  describe('validateApiKey', () => {
    it('should return null for non-existent API key', async () => {
      mockRepository.find.mockResolvedValue([]);

      const validated = await service.validateApiKey('invalid_key');

      expect(validated).toBeNull();
    });
  });

  describe('findAll', () => {
    it('should return all API keys', async () => {
      const mockKeys = [
        {
          id: '1',
          name: 'Key 1',
          role: ApiKeyRole.USER,
          isActive: true,
          createdAt: new Date(),
          rateLimit: 100,
          requestCount: BigInt(0),
        },
        {
          id: '2',
          name: 'Key 2',
          role: ApiKeyRole.ADMIN,
          isActive: true,
          createdAt: new Date(),
          rateLimit: 200,
          requestCount: BigInt(10),
        },
      ];

      mockRepository.find.mockResolvedValue(mockKeys);

      const result = await service.findAll();

      expect(result).toHaveLength(2);
      expect(result[0]).not.toHaveProperty('hashedKey');
    });
  });

  describe('findOne', () => {
    it('should return an API key by ID', async () => {
      const mockKey = {
        id: '1',
        name: 'Test Key',
        role: ApiKeyRole.USER,
        isActive: true,
        createdAt: new Date(),
        rateLimit: 100,
        requestCount: BigInt(0),
      };

      mockRepository.findOne.mockResolvedValue(mockKey);

      const found = await service.findOne('1');

      expect(found.id).toBe('1');
      expect(found.name).toBe('Test Key');
    });

    it('should throw NotFoundException for non-existent ID', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne('non-existent-id')).rejects.toThrow(
        NotFoundException
      );
    });
  });

  describe('revokeApiKey', () => {
    it('should revoke an API key', async () => {
      const mockKey = {
        id: '1',
        name: 'Test Key',
        isActive: true,
      };

      mockRepository.findOne.mockResolvedValue(mockKey);
      mockRepository.save.mockResolvedValue({ ...mockKey, isActive: false });

      await service.revokeApiKey('1');

      expect(mockRepository.save).toHaveBeenCalled();
    });

    it('should throw NotFoundException for non-existent ID', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.revokeApiKey('non-existent-id')).rejects.toThrow(
        NotFoundException
      );
    });
  });

  describe('deleteApiKey', () => {
    it('should delete an API key', async () => {
      const mockKey = {
        id: '1',
        name: 'Test Key',
      };

      mockRepository.findOne.mockResolvedValue(mockKey);
      mockRepository.remove.mockResolvedValue(mockKey);

      await service.deleteApiKey('1');

      expect(mockRepository.remove).toHaveBeenCalledWith(mockKey);
    });

    it('should throw NotFoundException for non-existent ID', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.deleteApiKey('non-existent-id')).rejects.toThrow(
        NotFoundException
      );
    });
  });
});
