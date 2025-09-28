// Base provider classes
export { BaseKBOProvider } from './base-kbo-provider';
export { KBODataProvider } from './kbo-data-provider';
export { MockKBOProvider } from './mock-kbo-provider';

// Factory pattern
export { KBOProviderFactory } from './factory';
export type { KBOProviderType, KBOProviderFactoryConfig } from './factory';

// Error handling
export {
  KBOProviderError,
  KBOValidationError,
  KBONetworkError,
  KBONotFoundError,
  KBORateLimitError,
  KBOAuthenticationError,
  KBOConfigurationError,
  isKBOProviderError,
  handleHttpError
} from './errors';

// Configuration validation
export {
  validateProviderConfig,
  validateFactoryConfig,
  validateEnterpriseNumber,
  validateEstablishmentNumber,
  formatEnterpriseNumber,
  formatEstablishmentNumber
} from './config-validator';

// Re-export types from kbo types
export type {
  KBOProvider,
  KBOProviderConfig,
  KBOCompany,
  Enterprise,
  Establishment,
  EnterpriseComplete,
  EstablishmentComplete,
  KBOApiResponse,
  EnterpriseSearchParams,
  EstablishmentSearchParams
} from '../types/kbo';