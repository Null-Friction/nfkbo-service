import { OnModuleInit } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { ApiKeyEntity } from '../entities/api-key-db.entity';
import { ApiKey } from '../entities/api-key.entity';
import { CreateApiKeyDto } from '../dto/create-api-key.dto';
import { ApiKeyResponseDto, CreatedApiKeyResponseDto } from '../dto/api-key-response.dto';
export declare class ApiKeyService implements OnModuleInit {
    private readonly apiKeyRepository;
    private readonly configService;
    private readonly logger;
    private bootstrapKey;
    constructor(apiKeyRepository: Repository<ApiKeyEntity>, configService: ConfigService);
    onModuleInit(): Promise<void>;
    createApiKey(createDto: CreateApiKeyDto, createdBy?: string): Promise<CreatedApiKeyResponseDto>;
    validateApiKey(key: string, ipAddress?: string): Promise<ApiKey | null>;
    findAll(): Promise<ApiKeyResponseDto[]>;
    findOne(id: string): Promise<ApiKeyResponseDto>;
    revokeApiKey(id: string, revokedBy?: string): Promise<void>;
    deleteApiKey(id: string, deletedBy?: string): Promise<void>;
    private generateApiKey;
}
