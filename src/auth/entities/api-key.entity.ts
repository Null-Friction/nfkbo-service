export enum ApiKeyRole {
  ADMIN = 'admin',
  USER = 'user',
  READ_ONLY = 'read_only',
}

export interface ApiKey {
  id: string;
  key: string;
  hashedKey: string;
  name: string;
  role: ApiKeyRole;
  isActive: boolean;
  createdAt: Date;
  lastUsedAt?: Date;
  expiresAt?: Date;
  rateLimit: number;
  requestCount: number;
}