import { z } from 'zod';
export type KBOLanguage = 'unknown' | 'nl' | 'en' | 'fr' | 'de';
export type KBOEntityType = 'enterprise' | 'establishment';
export type KBOEnterpriseType = 'natural' | 'entity';
export type KBODenominationType = 'social' | 'abbreviation' | 'commercial';
export interface MultilingualText {
    nl?: string;
    fr?: string;
    de?: string;
    en?: string;
}
export interface JuridicalForm {
    code: string;
    description: MultilingualText;
}
export interface JuridicalSituation {
    code: string;
    description: MultilingualText;
    dateStart: string;
    dateEnd?: string;
}
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
export interface Establishment {
    enterpriseNumber: string;
    establishmentNumber: string;
    active: boolean;
    dateStart: string;
    dateEnd?: string;
}
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
export interface NaceActivity {
    naceVersion: number;
    naceCode: string;
    description: MultilingualText;
    classification: string;
    dateStart: string;
    dateEnd?: string;
}
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
export interface EnterpriseComplete extends Enterprise {
    denominations: Denomination[];
    addresses: Address[];
    establishments: Establishment[];
    activities: NaceActivity[];
}
export interface EstablishmentComplete extends Establishment {
    denominations: Denomination[];
    addresses: Address[];
    activities: NaceActivity[];
}
export declare const KBOLanguageSchema: z.ZodEnum<{
    unknown: "unknown";
    nl: "nl";
    en: "en";
    fr: "fr";
    de: "de";
}>;
export declare const KBOEntityTypeSchema: z.ZodEnum<{
    enterprise: "enterprise";
    establishment: "establishment";
}>;
export declare const KBOEnterpriseTypeSchema: z.ZodEnum<{
    natural: "natural";
    entity: "entity";
}>;
export declare const KBODenominationTypeSchema: z.ZodEnum<{
    social: "social";
    abbreviation: "abbreviation";
    commercial: "commercial";
}>;
export declare const MultilingualTextSchema: z.ZodObject<{
    nl: z.ZodOptional<z.ZodString>;
    fr: z.ZodOptional<z.ZodString>;
    de: z.ZodOptional<z.ZodString>;
    en: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const JuridicalFormSchema: z.ZodObject<{
    code: z.ZodString;
    description: z.ZodObject<{
        nl: z.ZodOptional<z.ZodString>;
        fr: z.ZodOptional<z.ZodString>;
        de: z.ZodOptional<z.ZodString>;
        en: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>;
}, z.core.$strip>;
export declare const JuridicalSituationSchema: z.ZodObject<{
    code: z.ZodString;
    description: z.ZodObject<{
        nl: z.ZodOptional<z.ZodString>;
        fr: z.ZodOptional<z.ZodString>;
        de: z.ZodOptional<z.ZodString>;
        en: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>;
    dateStart: z.ZodString;
    dateEnd: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const EnterpriseSchema: z.ZodObject<{
    enterpriseNumber: z.ZodString;
    vatNumber: z.ZodOptional<z.ZodString>;
    active: z.ZodBoolean;
    type: z.ZodEnum<{
        natural: "natural";
        entity: "entity";
    }>;
    typeDescription: z.ZodObject<{
        nl: z.ZodOptional<z.ZodString>;
        fr: z.ZodOptional<z.ZodString>;
        de: z.ZodOptional<z.ZodString>;
        en: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>;
    dateStart: z.ZodString;
    dateEnd: z.ZodOptional<z.ZodString>;
    juridicalForm: z.ZodOptional<z.ZodObject<{
        code: z.ZodString;
        description: z.ZodObject<{
            nl: z.ZodOptional<z.ZodString>;
            fr: z.ZodOptional<z.ZodString>;
            de: z.ZodOptional<z.ZodString>;
            en: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>;
    }, z.core.$strip>>;
    juridicalSituation: z.ZodOptional<z.ZodObject<{
        code: z.ZodString;
        description: z.ZodObject<{
            nl: z.ZodOptional<z.ZodString>;
            fr: z.ZodOptional<z.ZodString>;
            de: z.ZodOptional<z.ZodString>;
            en: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>;
        dateStart: z.ZodString;
        dateEnd: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>;
}, z.core.$strip>;
export declare const EstablishmentSchema: z.ZodObject<{
    enterpriseNumber: z.ZodString;
    establishmentNumber: z.ZodString;
    active: z.ZodBoolean;
    dateStart: z.ZodString;
    dateEnd: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const AddressSchema: z.ZodObject<{
    entityNumber: z.ZodString;
    entityType: z.ZodEnum<{
        enterprise: "enterprise";
        establishment: "establishment";
    }>;
    street: z.ZodObject<{
        nl: z.ZodOptional<z.ZodString>;
        fr: z.ZodOptional<z.ZodString>;
        de: z.ZodOptional<z.ZodString>;
        en: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>;
    addressNumber: z.ZodOptional<z.ZodString>;
    boxNumber: z.ZodOptional<z.ZodString>;
    zipcode: z.ZodString;
    city: z.ZodObject<{
        nl: z.ZodOptional<z.ZodString>;
        fr: z.ZodOptional<z.ZodString>;
        de: z.ZodOptional<z.ZodString>;
        en: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>;
    countryCode: z.ZodString;
    dateStart: z.ZodString;
    dateEnd: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const DenominationSchema: z.ZodObject<{
    entityNumber: z.ZodString;
    entityType: z.ZodEnum<{
        enterprise: "enterprise";
        establishment: "establishment";
    }>;
    language: z.ZodEnum<{
        unknown: "unknown";
        nl: "nl";
        en: "en";
        fr: "fr";
        de: "de";
    }>;
    value: z.ZodString;
    type: z.ZodEnum<{
        social: "social";
        abbreviation: "abbreviation";
        commercial: "commercial";
    }>;
    typeDescription: z.ZodObject<{
        nl: z.ZodOptional<z.ZodString>;
        fr: z.ZodOptional<z.ZodString>;
        de: z.ZodOptional<z.ZodString>;
        en: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>;
    dateStart: z.ZodString;
    dateEnd: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const NaceActivitySchema: z.ZodObject<{
    naceVersion: z.ZodNumber;
    naceCode: z.ZodString;
    description: z.ZodObject<{
        nl: z.ZodOptional<z.ZodString>;
        fr: z.ZodOptional<z.ZodString>;
        de: z.ZodOptional<z.ZodString>;
        en: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>;
    classification: z.ZodString;
    dateStart: z.ZodString;
    dateEnd: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const KBOCompanySchema: z.ZodObject<{
    number: z.ZodString;
    name: z.ZodString;
    address: z.ZodObject<{
        street: z.ZodString;
        city: z.ZodString;
        postalCode: z.ZodString;
        country: z.ZodString;
    }, z.core.$strip>;
    status: z.ZodEnum<{
        active: "active";
        inactive: "inactive";
        dissolved: "dissolved";
    }>;
    legalForm: z.ZodString;
    establishmentDate: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type KBOCompany = z.infer<typeof KBOCompanySchema>;
export interface KBOProvider {
    searchByNumber(number: string): Promise<KBOCompany | null>;
    searchByName(name: string): Promise<KBOCompany[]>;
    getEnterprise(enterpriseNumber: string): Promise<EnterpriseComplete | null>;
    getEstablishment(establishmentNumber: string): Promise<EstablishmentComplete | null>;
    searchEnterprises(params: EnterpriseSearchParams): Promise<KBOApiResponse<Enterprise[]>>;
    searchEstablishments(params: EstablishmentSearchParams): Promise<KBOApiResponse<Establishment[]>>;
}
export interface KBOProviderConfig {
    apiKey?: string;
    baseUrl?: string;
    timeout?: number;
}
