import { KBOProvider, KBOProviderConfig } from '../types/kbo';
import { KBODataProvider } from './kbo-data-provider';
import { MockKBOProvider } from './mock-kbo-provider';

export type KBOProviderType = 'kbo-data' | 'mock';

export interface KBOProviderFactoryConfig extends KBOProviderConfig {
  type: KBOProviderType;
}

export class KBOProviderFactory {
  private static providers: Map<string, KBOProvider> = new Map();

  static createProvider(config: KBOProviderFactoryConfig): KBOProvider {
    const cacheKey = `${config.type}_${config.baseUrl || 'default'}`;

    if (this.providers.has(cacheKey)) {
      return this.providers.get(cacheKey);
    }

    let provider: KBOProvider;

    switch (config.type) {
      case 'kbo-data':
        provider = new KBODataProvider(config);
        break;
      case 'mock':
        provider = new MockKBOProvider(config);
        break;
      default:
        throw new Error(`Unknown provider type: ${config.type}`);
    }

    this.providers.set(cacheKey, provider);
    return provider;
  }

  static clearCache(): void {
    this.providers.clear();
  }

  static getDefaultProvider(): KBOProvider {
    return this.createProvider({
      type: 'kbo-data',
      baseUrl: 'https://api.kbodata.app/v1',
      timeout: 10000,
    });
  }

  static getMockProvider(): KBOProvider {
    return this.createProvider({
      type: 'mock',
    });
  }
}