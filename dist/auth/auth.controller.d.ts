import { ApiKeyService } from './services/api-key.service';
import { CreateApiKeyDto } from './dto/create-api-key.dto';
import { ApiKeyResponseDto, CreatedApiKeyResponseDto } from './dto/api-key-response.dto';
export declare class AuthController {
    private readonly apiKeyService;
    constructor(apiKeyService: ApiKeyService);
    create(createApiKeyDto: CreateApiKeyDto): Promise<CreatedApiKeyResponseDto>;
    findAll(): Promise<ApiKeyResponseDto[]>;
    findOne(id: string): Promise<ApiKeyResponseDto>;
    revoke(id: string): Promise<{
        message: string;
    }>;
    delete(id: string): Promise<{
        message: string;
    }>;
}
