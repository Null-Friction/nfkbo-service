import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ApiKeyService } from '../services/api-key.service';
export declare class ApiKeyGuard implements CanActivate {
    private readonly apiKeyService;
    private readonly reflector;
    constructor(apiKeyService: ApiKeyService, reflector: Reflector);
    canActivate(context: ExecutionContext): Promise<boolean>;
    private extractApiKeyFromHeader;
    private extractIpAddress;
}
