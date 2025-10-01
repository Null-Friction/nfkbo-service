import { Injectable } from '@nestjs/common';
import {
  HealthIndicator,
  HealthIndicatorResult,
  HealthCheckError,
} from '@nestjs/terminus';
import { AppConfigService } from '../../config/config.service';

@Injectable()
export class KboProviderHealthIndicator extends HealthIndicator {
  constructor(private readonly configService: AppConfigService) {
    super();
  }

  async isHealthy(key: string): Promise<HealthIndicatorResult> {
    const isHealthy = await this.checkKboProviderHealth();
    const result = this.getStatus(key, isHealthy, {
      baseUrl: this.configService.kboApiBaseUrl,
      useRealProvider: this.configService.useRealKboProvider,
      timeout: this.configService.kboApiTimeout,
    });

    if (isHealthy) {
      return result;
    }

    throw new HealthCheckError('KBO Provider Health Check Failed', result);
  }

  private async checkKboProviderHealth(): Promise<boolean> {
    try {
      // If using mock provider, always return healthy
      if (!this.configService.useRealKboProvider) {
        return true;
      }

      // For real provider, we'll just validate configuration without making requests
      // to avoid consuming API quota for health checks
      const hasValidConfig = this.validateKboConfiguration();

      return hasValidConfig;
    } catch {
      return false;
    }
  }

  private validateKboConfiguration(): boolean {
    // Check if we have a valid base URL
    const baseUrl = this.configService.kboApiBaseUrl;
    if (!baseUrl || !this.isValidUrl(baseUrl)) {
      return false;
    }

    // Check if timeout is reasonable
    const timeout = this.configService.kboApiTimeout;
    if (timeout <= 0 || timeout > 60000) {
      // Max 60 seconds
      return false;
    }

    // If API key is required, check if it exists (but don't validate it remotely)
    // This is a basic validation - in production you might want to validate format
    // For now, we'll assume API key is optional and just check configuration validity

    return true;
  }

  private isValidUrl(urlString: string): boolean {
    try {
      const url = new URL(urlString);
      return url.protocol === 'http:' || url.protocol === 'https:';
    } catch {
      return false;
    }
  }
}
