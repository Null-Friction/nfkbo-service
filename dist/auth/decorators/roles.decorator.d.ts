import { ApiKeyRole } from '../entities/api-key.entity';
export declare const ROLES_KEY = "roles";
export declare const Roles: (...roles: ApiKeyRole[]) => import("@nestjs/common").CustomDecorator<string>;
