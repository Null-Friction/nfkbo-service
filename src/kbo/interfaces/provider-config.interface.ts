import { KBOProviderType } from '../../providers/factory';

/**
 * Configuration interface for KBO provider dependency injection
 */
export interface KBOProviderDIConfig {
  type: KBOProviderType;
  apiKey?: string;
  baseUrl?: string;
  timeout?: number;
  useRealProvider?: boolean;
}

/**
 * Factory configuration for creating KBO providers
 */
export interface KBOProviderFactoryDIConfig extends KBOProviderDIConfig {
  validateConfig?: boolean;
  enableHealthCheck?: boolean;
}