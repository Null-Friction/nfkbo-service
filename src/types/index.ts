// Export all KBO types
export * from './kbo';

// Re-export commonly used types for convenience
export type {
  Enterprise,
  Establishment,
  Address,
  Denomination,
  NaceActivity,
  EnterpriseComplete,
  EstablishmentComplete,
  KBOApiResponse,
  KBOErrorResponse,
  EnterpriseSearchParams,
  EstablishmentSearchParams,
  KBOProvider,
  KBOProviderConfig,
  KBOLanguage,
  KBOEntityType,
  MultilingualText,
} from './kbo';