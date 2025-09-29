import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ApiKeyService } from '../services/api-key.service';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { ApiKeyRole } from '../entities/api-key.entity';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(
    private readonly apiKeyService: ApiKeyService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const apiKey = this.extractApiKeyFromHeader(request);

    if (!apiKey) {
      throw new UnauthorizedException('API key is missing');
    }

    const validatedKey = await this.apiKeyService.validateApiKey(apiKey);

    if (!validatedKey) {
      throw new UnauthorizedException('Invalid API key');
    }

    // Check if the key has required roles
    const requiredRoles = this.reflector.getAllAndOverride<ApiKeyRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (requiredRoles) {
      const hasRole = requiredRoles.includes(validatedKey.role);
      if (!hasRole) {
        throw new UnauthorizedException(
          'Insufficient permissions for this operation',
        );
      }
    }

    // Attach the API key to the request for use in rate limiting
    request.apiKey = validatedKey;

    return true;
  }

  private extractApiKeyFromHeader(request: any): string | undefined {
    const authHeader = request.headers['x-api-key'];
    return authHeader || undefined;
  }
}