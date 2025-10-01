import { z } from 'zod';

// Base types
export type KBOLanguage = 'unknown' | 'nl' | 'en' | 'fr' | 'de';
export type KBOEntityType = 'enterprise' | 'establishment';
export type KBOEnterpriseType = 'natural' | 'entity';
export type KBODenominationType = 'social' | 'abbreviation' | 'commercial';

// Multilingual support interface
export interface MultilingualText {
  nl?: string;
  fr?: string;
  de?: string;
  en?: string;
}

// Juridical Form
export interface JuridicalForm {
  code: string;
  description: MultilingualText;
}

// Juridical Situation
export interface JuridicalSituation {
  code: string;
  description: MultilingualText;
  dateStart: string;
  dateEnd?: string;
}

// Enterprise Entity
export interface Enterprise {
  enterpriseNumber: string;
  vatNumber?: string;
  active: boolean;
  type: KBOEnterpriseType;
  typeDescription: MultilingualText;
  dateStart: string;
  dateEnd?: string;
  juridicalForm?: JuridicalForm;
  juridicalSituation?: JuridicalSituation;
}

// Establishment Entity
export interface Establishment {
  enterpriseNumber: string;
  establishmentNumber: string;
  active: boolean;
  dateStart: string;
  dateEnd?: string;
}

// Address Entity
export interface Address {
  entityNumber: string;
  entityType: KBOEntityType;
  street: MultilingualText;
  addressNumber?: string;
  boxNumber?: string;
  zipcode: string;
  city: MultilingualText;
  countryCode: string;
  dateStart: string;
  dateEnd?: string;
}

// Denomination Entity
export interface Denomination {
  entityNumber: string;
  entityType: KBOEntityType;
  language: KBOLanguage;
  value: string;
  type: KBODenominationType;
  typeDescription: MultilingualText;
  dateStart: string;
  dateEnd?: string;
}

// NACE Activity
export interface NaceActivity {
  naceVersion: number;
  naceCode: string;
  description: MultilingualText;
  classification: string;
  dateStart: string;
  dateEnd?: string;
}

// API Response Wrappers
export interface KBOApiResponse<T> {
  data: T;
  meta?: {
    totalItems: number;
    itemsPerPage: number;
    currentPage: number;
    totalPages: number;
  };
}

export interface KBOErrorResponse {
  error: {
    code: string;
    message: string;
    details?: string;
  };
}

// Search and Filter Parameters
export interface EnterpriseSearchParams {
  enterpriseNumber?: string;
  vatNumber?: string;
  denomination?: string;
  juridicalForm?: string;
  naceCode?: string;
  active?: boolean;
  zipcode?: string;
  city?: string;
  page?: number;
  limit?: number;
}

export interface EstablishmentSearchParams {
  enterpriseNumber?: string;
  establishmentNumber?: string;
  denomination?: string;
  active?: boolean;
  zipcode?: string;
  city?: string;
  page?: number;
  limit?: number;
}

// Complete Enterprise with related data
export interface EnterpriseComplete extends Enterprise {
  denominations: Denomination[];
  addresses: Address[];
  establishments: Establishment[];
  activities: NaceActivity[];
}

// Complete Establishment with related data
export interface EstablishmentComplete extends Establishment {
  denominations: Denomination[];
  addresses: Address[];
  activities: NaceActivity[];
}

// Zod Schemas for validation
export const KBOLanguageSchema = z.enum(['unknown', 'nl', 'en', 'fr', 'de']);
export const KBOEntityTypeSchema = z.enum(['enterprise', 'establishment']);
export const KBOEnterpriseTypeSchema = z.enum(['natural', 'entity']);
export const KBODenominationTypeSchema = z.enum([
  'social',
  'abbreviation',
  'commercial',
]);

export const MultilingualTextSchema = z.object({
  nl: z.string().optional(),
  fr: z.string().optional(),
  de: z.string().optional(),
  en: z.string().optional(),
});

export const JuridicalFormSchema = z.object({
  code: z.string(),
  description: MultilingualTextSchema,
});

export const JuridicalSituationSchema = z.object({
  code: z.string(),
  description: MultilingualTextSchema,
  dateStart: z.string(),
  dateEnd: z.string().optional(),
});

export const EnterpriseSchema = z.object({
  enterpriseNumber: z.string(),
  vatNumber: z.string().optional(),
  active: z.boolean(),
  type: KBOEnterpriseTypeSchema,
  typeDescription: MultilingualTextSchema,
  dateStart: z.string(),
  dateEnd: z.string().optional(),
  juridicalForm: JuridicalFormSchema.optional(),
  juridicalSituation: JuridicalSituationSchema.optional(),
});

export const EstablishmentSchema = z.object({
  enterpriseNumber: z.string(),
  establishmentNumber: z.string(),
  active: z.boolean(),
  dateStart: z.string(),
  dateEnd: z.string().optional(),
});

export const AddressSchema = z.object({
  entityNumber: z.string(),
  entityType: KBOEntityTypeSchema,
  street: MultilingualTextSchema,
  addressNumber: z.string().optional(),
  boxNumber: z.string().optional(),
  zipcode: z.string(),
  city: MultilingualTextSchema,
  countryCode: z.string(),
  dateStart: z.string(),
  dateEnd: z.string().optional(),
});

export const DenominationSchema = z.object({
  entityNumber: z.string(),
  entityType: KBOEntityTypeSchema,
  language: KBOLanguageSchema,
  value: z.string(),
  type: KBODenominationTypeSchema,
  typeDescription: MultilingualTextSchema,
  dateStart: z.string(),
  dateEnd: z.string().optional(),
});

export const NaceActivitySchema = z.object({
  naceVersion: z.number(),
  naceCode: z.string(),
  description: MultilingualTextSchema,
  classification: z.string(),
  dateStart: z.string(),
  dateEnd: z.string().optional(),
});

// Legacy compatibility - backward compatibility with existing simple structure
export const KBOCompanySchema = z.object({
  number: z.string(),
  name: z.string(),
  address: z.object({
    street: z.string(),
    city: z.string(),
    postalCode: z.string(),
    country: z.string(),
  }),
  status: z.enum(['active', 'inactive', 'dissolved']),
  legalForm: z.string(),
  establishmentDate: z.string().optional(),
});

export type KBOCompany = z.infer<typeof KBOCompanySchema>;

// Provider interfaces
export interface KBOProvider {
  searchByNumber(number: string): Promise<KBOCompany | null>;
  searchByName(name: string): Promise<KBOCompany[]>;
  // Extended methods for new comprehensive types
  getEnterprise(enterpriseNumber: string): Promise<EnterpriseComplete | null>;
  getEstablishment(
    establishmentNumber: string
  ): Promise<EstablishmentComplete | null>;
  searchEnterprises(
    params: EnterpriseSearchParams
  ): Promise<KBOApiResponse<Enterprise[]>>;
  searchEstablishments(
    params: EstablishmentSearchParams
  ): Promise<KBOApiResponse<Establishment[]>>;
}

export interface KBOProviderConfig {
  apiKey?: string;
  baseUrl?: string;
  timeout?: number;
}
