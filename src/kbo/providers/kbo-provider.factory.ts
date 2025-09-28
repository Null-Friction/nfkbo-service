import { Logger } from '@nestjs/common';
import { AppConfigService } from '../../config/config.service';
import { KBOProvider } from '../../common/types/kbo';
import { KBOProviderFactory, KBOProviderType } from '../../common/providers/factory';
import { KBOProviderDIConfig } from '../interfaces/provider-config.interface';
import { validateProviderConfig } from '../../common/providers/config-validator';

/**
 * Factory function for creating KBO providers with dependency injection
 */
export async function createKBOProvider(
  configService: AppConfigService
): Promise<KBOProvider> {
  const logger = new Logger('KBOProviderFactory');

  try {
    // Determine provider type based on configuration
    const providerType: KBOProviderType = configService.useRealKboProvider ? 'kbo-data' : 'mock';

    // Build provider configuration
    const providerConfig: KBOProviderDIConfig = {
      type: providerType,
      apiKey: configService.kboApiKey,
      baseUrl: configService.kboApiBaseUrl,
      timeout: configService.kboApiTimeout,
      useRealProvider: configService.useRealKboProvider,
    };

    // Validate configuration if it's for real provider
    if (providerType === 'kbo-data') {
      validateProviderConfig(providerConfig);
      logger.log('Using real KBO data provider');
    } else {
      logger.log('Using mock KBO provider');
    }

    // Create provider using existing factory
    const provider = KBOProviderFactory.createProvider({
      type: providerConfig.type,
      apiKey: providerConfig.apiKey,
      baseUrl: providerConfig.baseUrl,
      timeout: providerConfig.timeout,
    });

    // Health check for real provider
    if (providerType === 'kbo-data') {
      await performHealthCheck(provider, logger);
    }

    logger.log(`KBO provider initialized successfully: ${providerType}`);
    return provider;

  } catch (error) {
    logger.error('Failed to create KBO provider', error);

    // Fallback to mock provider if real provider fails
    if (configService.useRealKboProvider) {
      logger.warn('Falling back to mock provider due to initialization failure');
      return KBOProviderFactory.createProvider({ type: 'mock' });
    }

    throw error;
  }
}

/**
 * Performs basic health check on the provider
 */
async function performHealthCheck(provider: KBOProvider, logger: Logger): Promise<void> {
  try {
    // Try a simple search operation to verify the provider is working
    // Using a well-known enterprise number for testing
    await provider.searchByNumber('0776834537'); // This is a test number
    logger.log('Provider health check passed');
  } catch (error) {
    logger.warn('Provider health check failed, but continuing anyway', error);
    // Don't throw here - let the provider be used even if health check fails
  }
}