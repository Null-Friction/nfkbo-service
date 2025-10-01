import { ApiKeyRole } from '../entities/api-key.entity';
export declare class ApiKeyResponseDto {
    id: string;
    name: string;
    role: ApiKeyRole;
    isActive: boolean;
    createdAt: Date;
    lastUsedAt?: Date | null;
    expiresAt?: Date | null;
    rateLimit: number;
    requestCount: number;
}
export declare class CreatedApiKeyResponseDto extends ApiKeyResponseDto {
    key: string;
}
