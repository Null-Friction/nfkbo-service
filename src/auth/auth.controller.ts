import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { Roles } from './decorators/roles.decorator';
import {
  ApiKeyResponseDto,
  CreatedApiKeyResponseDto,
} from './dto/api-key-response.dto';
import { CreateApiKeyDto } from './dto/create-api-key.dto';
import { ApiKeyRole } from './entities/api-key.entity';
import { ApiKeyGuard } from './guards/api-key.guard';
import { ApiKeyService } from './services/api-key.service';

@Controller('auth/api-keys')
@UseGuards(ApiKeyGuard)
export class AuthController {
  constructor(private readonly apiKeyService: ApiKeyService) {}

  @Post()
  @Roles(ApiKeyRole.ADMIN)
  async create(
    @Body() createApiKeyDto: CreateApiKeyDto,
  ): Promise<CreatedApiKeyResponseDto> {
    return this.apiKeyService.createApiKey(createApiKeyDto);
  }

  @Get()
  @Roles(ApiKeyRole.ADMIN)
  async findAll(): Promise<ApiKeyResponseDto[]> {
    return this.apiKeyService.findAll();
  }

  @Get(':id')
  @Roles(ApiKeyRole.ADMIN)
  async findOne(@Param('id') id: string): Promise<ApiKeyResponseDto> {
    return this.apiKeyService.findOne(id);
  }

  @Delete(':id/revoke')
  @Roles(ApiKeyRole.ADMIN)
  async revoke(@Param('id') id: string): Promise<{ message: string }> {
    await this.apiKeyService.revokeApiKey(id);
    return { message: 'API key revoked successfully' };
  }

  @Delete(':id')
  @Roles(ApiKeyRole.ADMIN)
  async delete(@Param('id') id: string): Promise<{ message: string }> {
    await this.apiKeyService.deleteApiKey(id);
    return { message: 'API key deleted successfully' };
  }
}