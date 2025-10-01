import { ApiKeyRole } from '../entities/api-key.entity';

export class ApiKeyResponseDto {
  id!: string;
  name!: string;
  role!: ApiKeyRole;
  isActive!: boolean;
  createdAt!: Date;
  lastUsedAt?: Date | null;
  expiresAt?: Date | null;
  rateLimit!: number;
  requestCount!: number;
}

export class CreatedApiKeyResponseDto extends ApiKeyResponseDto {
  key!: string; // Only returned on creation
}
