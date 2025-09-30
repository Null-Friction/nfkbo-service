import { ApiKeyRole } from '../entities/api-key.entity';
export declare class CreateApiKeyDto {
    name: string;
    role: ApiKeyRole;
    expiresAt?: string;
    rateLimit?: number;
}
