import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { ApiKey } from '../entities/api-key.entity';

export const CurrentApiKey = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): ApiKey => {
    const request = ctx.switchToHttp().getRequest();
    return request.apiKey;
  }
);
