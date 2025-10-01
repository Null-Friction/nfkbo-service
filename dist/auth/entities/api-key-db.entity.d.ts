import { ApiKeyRole } from './api-key.entity';
export declare class ApiKeyEntity {
    id: string;
    lookupKey: string;
    hashedKey: string;
    name: string;
    role: ApiKeyRole;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    lastUsedAt: Date | null;
    expiresAt: Date | null;
    rateLimit: number;
    requestCount: bigint;
    createdBy: string | null;
    lastUsedIp: string | null;
}
