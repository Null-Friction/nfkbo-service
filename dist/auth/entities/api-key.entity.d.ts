export declare enum ApiKeyRole {
    ADMIN = "admin",
    USER = "user",
    READ_ONLY = "read_only"
}
export interface ApiKey {
    id: string;
    key: string;
    hashedKey: string;
    name: string;
    role: ApiKeyRole;
    isActive: boolean;
    createdAt: Date;
    lastUsedAt?: Date | null;
    expiresAt?: Date | null;
    rateLimit: number;
    requestCount: number;
}
