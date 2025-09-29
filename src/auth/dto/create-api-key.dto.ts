import { IsString, IsEnum, IsOptional, IsNumber, IsDateString, Min } from 'class-validator';
import { ApiKeyRole } from '../entities/api-key.entity';

export class CreateApiKeyDto {
  @IsString()
  name: string;

  @IsEnum(ApiKeyRole)
  role: ApiKeyRole;

  @IsOptional()
  @IsDateString()
  expiresAt?: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  rateLimit?: number;
}