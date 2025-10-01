import { OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import { ApiKeyResponseDto, CreatedApiKeyResponseDto } from '../dto/api-key-response.dto';
import { CreateApiKeyDto } from '../dto/create-api-key.dto';
import { ApiKeyEntity } from '../entities/api-key-db.entity';
import { ApiKey } from '../entities/api-key.entity';
export declare class ApiKeyService implements OnModuleInit {
    private readonly apiKeyRepository;
    private readonly configService;
    private readonly logger;
    private bootstrapKeyHash;
    constructor(apiKeyRepository: Repository<ApiKeyEntity>, configService: ConfigService);
    private generateLookupKey;
    onModuleInit(): Promise<void>;
    createApiKey(createDto: CreateApiKeyDto, createdBy?: string): Promise<CreatedApiKeyResponseDto>;
    validateApiKey(key: string, ipAddress?: string): Promise<ApiKey | null>;
    findAll(): Promise<ApiKeyResponseDto[]>;
    findOne(id: string): Promise<ApiKeyResponseDto>;
    revokeApiKey(id: string, revokedBy?: string): Promise<void>;
    deleteApiKey(id: string, deletedBy?: string): Promise<void>;
    private generateApiKey;
}
