import { SetMetadata } from '@nestjs/common';
import { ApiKeyRole } from '../entities/api-key.entity';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: ApiKeyRole[]) => SetMetadata(ROLES_KEY, roles);