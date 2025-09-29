import { Injectable, NotFoundException } from '@nestjs/common';
import { randomBytes } from 'crypto';
import * as bcrypt from 'bcrypt';
import { ApiKey, ApiKeyRole } from '../entities/api-key.entity';
import { CreateApiKeyDto } from '../dto/create-api-key.dto';
import {
  ApiKeyResponseDto,
  CreatedApiKeyResponseDto,
} from '../dto/api-key-response.dto';

@Injectable()
export class ApiKeyService {
  private apiKeys: Map<string, ApiKey> = new Map();

  async createApiKey(
    createDto: CreateApiKeyDto,
  ): Promise<CreatedApiKeyResponseDto> {
    const key = this.generateApiKey();
    const hashedKey = await bcrypt.hash(key, 10);

    const apiKey: ApiKey = {
      id: randomBytes(16).toString('hex'),
      key, // Store temporarily for response
      hashedKey,
      name: createDto.name,
      role: createDto.role,
      isActive: true,
      createdAt: new Date(),
      expiresAt: createDto.expiresAt ? new Date(createDto.expiresAt) : undefined,
      rateLimit: createDto.rateLimit || 100,
      requestCount: 0,
    };

    this.apiKeys.set(apiKey.id, apiKey);

    return {
      id: apiKey.id,
      key: apiKey.key, // Only returned on creation
      name: apiKey.name,
      role: apiKey.role,
      isActive: apiKey.isActive,
      createdAt: apiKey.createdAt,
      expiresAt: apiKey.expiresAt,
      rateLimit: apiKey.rateLimit,
      requestCount: apiKey.requestCount,
    };
  }

  async validateApiKey(key: string): Promise<ApiKey | null> {
    for (const apiKey of this.apiKeys.values()) {
      const isMatch = await bcrypt.compare(key, apiKey.hashedKey);

      if (isMatch) {
        // Check if key is active
        if (!apiKey.isActive) {
          return null;
        }

        // Check if key is expired
        if (apiKey.expiresAt && new Date() > apiKey.expiresAt) {
          apiKey.isActive = false;
          return null;
        }

        // Update last used timestamp
        apiKey.lastUsedAt = new Date();
        apiKey.requestCount++;

        return apiKey;
      }
    }

    return null;
  }

  async findAll(): Promise<ApiKeyResponseDto[]> {
    return Array.from(this.apiKeys.values()).map((key) => ({
      id: key.id,
      name: key.name,
      role: key.role,
      isActive: key.isActive,
      createdAt: key.createdAt,
      lastUsedAt: key.lastUsedAt,
      expiresAt: key.expiresAt,
      rateLimit: key.rateLimit,
      requestCount: key.requestCount,
    }));
  }

  async findOne(id: string): Promise<ApiKeyResponseDto> {
    const apiKey = this.apiKeys.get(id);

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
      requestCount: apiKey.requestCount,
    };
  }

  async revokeApiKey(id: string): Promise<void> {
    const apiKey = this.apiKeys.get(id);

    if (!apiKey) {
      throw new NotFoundException(`API Key with ID ${id} not found`);
    }

    apiKey.isActive = false;
  }

  async deleteApiKey(id: string): Promise<void> {
    const deleted = this.apiKeys.delete(id);

    if (!deleted) {
      throw new NotFoundException(`API Key with ID ${id} not found`);
    }
  }

  private generateApiKey(): string {
    return `nfkbo_${randomBytes(32).toString('hex')}`;
  }

  // Method to check rate limit for a specific API key
  checkRateLimit(apiKey: ApiKey, windowMs: number = 60000): boolean {
    // Simple rate limiting check
    // In production, you'd use Redis or a more sophisticated solution
    return apiKey.requestCount <= apiKey.rateLimit;
  }
}