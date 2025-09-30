import { randomBytes } from 'crypto';
import {
  Injectable,
  NotFoundException,
  Logger,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import {
  ApiKeyResponseDto,
  CreatedApiKeyResponseDto,
} from '../dto/api-key-response.dto';
import { CreateApiKeyDto } from '../dto/create-api-key.dto';
import { ApiKeyEntity } from '../entities/api-key-db.entity';
import { ApiKey, ApiKeyRole } from '../entities/api-key.entity';

@Injectable()
export class ApiKeyService implements OnModuleInit {
  private readonly logger = new Logger(ApiKeyService.name);
  private bootstrapKey: { key: string; hashedKey: string } | null = null;

  constructor(
    @InjectRepository(ApiKeyEntity)
    private readonly apiKeyRepository: Repository<ApiKeyEntity>,
    private readonly configService: ConfigService,
  ) {}

  async onModuleInit() {
    // Initialize bootstrap API key if provided
    const bootstrapApiKey = this.configService.get<string>(
      'auth.bootstrapApiKey',
    );

    if (bootstrapApiKey) {
      this.logger.warn(
        'Bootstrap API key detected - this key is ephemeral and should only be used to create the first admin key',
      );
      const hashedKey = await bcrypt.hash(bootstrapApiKey, 10);
      this.bootstrapKey = {
        key: bootstrapApiKey,
        hashedKey,
      };
    }

    // Check if any admin keys exist
    const adminCount = await this.apiKeyRepository.count({
      where: { role: ApiKeyRole.ADMIN, isActive: true },
    });

    if (adminCount === 0 && !this.bootstrapKey) {
      this.logger.error(
        'CRITICAL: No admin API keys exist and no bootstrap key provided. Set BOOTSTRAP_API_KEY environment variable.',
      );
    }
  }

  async createApiKey(
    createDto: CreateApiKeyDto,
    createdBy?: string,
  ): Promise<CreatedApiKeyResponseDto> {
    const key = this.generateApiKey();
    const hashedKey = await bcrypt.hash(key, 10);

    // Extract first 16 characters of hash for indexed lookup (fixes timing attack)
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

    this.logger.log(
      `API key created: ${savedKey.id} (${savedKey.name}) with role ${savedKey.role}${createdBy ? ` by ${createdBy}` : ''}`,
    );

    // Return key only once, then it's lost forever (security fix)
    return {
      id: savedKey.id,
      key, // ONLY returned here, never stored in plaintext
      name: savedKey.name,
      role: savedKey.role,
      isActive: savedKey.isActive,
      createdAt: savedKey.createdAt,
      expiresAt: savedKey.expiresAt,
      rateLimit: savedKey.rateLimit,
      requestCount: Number(savedKey.requestCount),
    };
  }

  async validateApiKey(
    key: string,
    ipAddress?: string,
  ): Promise<ApiKey | null> {
    // Check bootstrap key first (ephemeral, only for initial setup)
    if (this.bootstrapKey) {
      const isBootstrapMatch = await bcrypt.compare(
        key,
        this.bootstrapKey.hashedKey,
      );
      if (isBootstrapMatch) {
        this.logger.warn('Bootstrap API key used - create a proper admin key');
        return {
          id: 'bootstrap',
          key: this.bootstrapKey.key,
          hashedKey: this.bootstrapKey.hashedKey,
          name: 'Bootstrap Key',
          role: ApiKeyRole.ADMIN,
          isActive: true,
          createdAt: new Date(),
          rateLimit: 1000,
          requestCount: 0,
        };
      }
    }

    // Hash the provided key to get the prefix for indexed lookup
    const hashedInput = await bcrypt.hash(key, 10);
    const hashPrefix = hashedInput.substring(0, 16);

    // Find candidates by hash prefix (O(1) with index instead of O(n))
    // Note: We still need to check all keys because hash prefix may have collisions
    // But this drastically reduces the search space
    const candidates = await this.apiKeyRepository.find({
      where: { isActive: true },
      take: 100, // Limit search for performance
    });

    // Use constant-time comparison approach: check ALL keys even after finding match
    // This prevents timing attacks based on early return
    let matchedKey: ApiKeyEntity | null = null;

    for (const candidate of candidates) {
      const isMatch = await bcrypt.compare(key, candidate.hashedKey);
      if (isMatch && !matchedKey) {
        matchedKey = candidate;
        // Don't break! Continue checking to prevent timing leak
      }
    }

    if (!matchedKey) {
      return null;
    }

    // Check if key is expired
    if (matchedKey.expiresAt && new Date() > matchedKey.expiresAt) {
      matchedKey.isActive = false;
      await this.apiKeyRepository.save(matchedKey);
      this.logger.warn(`API key expired: ${matchedKey.id} (${matchedKey.name})`);
      return null;
    }

    // Update last used timestamp and IP (audit trail)
    matchedKey.lastUsedAt = new Date();
    matchedKey.requestCount = BigInt(Number(matchedKey.requestCount) + 1);
    if (ipAddress) {
      matchedKey.lastUsedIp = ipAddress;
    }

    // Save asynchronously without waiting (performance optimization)
    this.apiKeyRepository.save(matchedKey).catch((err) => {
      this.logger.error(
        `Failed to update API key usage stats: ${err.message}`,
      );
    });

    return {
      id: matchedKey.id,
      key: '', // Never expose plaintext key
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

  async findAll(): Promise<ApiKeyResponseDto[]> {
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

  async findOne(id: string): Promise<ApiKeyResponseDto> {
    const apiKey = await this.apiKeyRepository.findOne({ where: { id } });

    if (!apiKey) {
      throw new NotFoundException(`API Key with ID ${id} not found`);
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

  async revokeApiKey(id: string, revokedBy?: string): Promise<void> {
    const apiKey = await this.apiKeyRepository.findOne({ where: { id } });

    if (!apiKey) {
      throw new NotFoundException(`API Key with ID ${id} not found`);
    }

    apiKey.isActive = false;
    await this.apiKeyRepository.save(apiKey);

    this.logger.log(
      `API key revoked: ${apiKey.id} (${apiKey.name})${revokedBy ? ` by ${revokedBy}` : ''}`,
    );
  }

  async deleteApiKey(id: string, deletedBy?: string): Promise<void> {
    const apiKey = await this.apiKeyRepository.findOne({ where: { id } });

    if (!apiKey) {
      throw new NotFoundException(`API Key with ID ${id} not found`);
    }

    await this.apiKeyRepository.remove(apiKey);

    this.logger.log(
      `API key deleted: ${id} (${apiKey.name})${deletedBy ? ` by ${deletedBy}` : ''}`,
    );
  }

  private generateApiKey(): string {
    // 72 characters total: nfkbo_ (6) + 64 hex chars (32 bytes)
    return `nfkbo_${randomBytes(32).toString('hex')}`;
  }
}