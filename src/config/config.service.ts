import { Injectable } from '@nestjs/common';
import { ConfigService as NestConfigService } from '@nestjs/config';
import { AppConfig } from './configuration';

@Injectable()
export class AppConfigService {
  constructor(private readonly configService: NestConfigService<AppConfig, true>) {}

  get port(): number {
    return this.configService.get('port', { infer: true });
  }

  get nodeEnv(): string {
    return this.configService.get('nodeEnv', { infer: true });
  }

  get kboApiKey(): string | undefined {
    return this.configService.get('kbo.apiKey', { infer: true });
  }

  get useRealKboProvider(): boolean {
    return this.configService.get('kbo.useRealProvider', { infer: true });
  }

  get kboApiBaseUrl(): string {
    return this.configService.get('kbo.baseUrl', { infer: true });
  }

  get kboApiTimeout(): number {
    return this.configService.get('kbo.timeout', { infer: true });
  }

  get isDevelopment(): boolean {
    return this.nodeEnv === 'development';
  }

  get isProduction(): boolean {
    return this.nodeEnv === 'production';
  }

  get isTest(): boolean {
    return this.nodeEnv === 'test';
  }
}