import { z } from 'zod';
import { KBOProviderConfig } from '@/types/kbo';
export declare const KBOProviderConfigSchema: z.ZodObject<{
    apiKey: z.ZodOptional<z.ZodString>;
    baseUrl: z.ZodOptional<z.ZodString>;
    timeout: z.ZodOptional<z.ZodNumber>;
}, z.core.$strip>;
export declare const KBOProviderFactoryConfigSchema: z.ZodObject<{
    type: z.ZodEnum<{
        "kbo-data": "kbo-data";
        mock: "mock";
    }>;
    apiKey: z.ZodOptional<z.ZodString>;
    baseUrl: z.ZodOptional<z.ZodString>;
    timeout: z.ZodOptional<z.ZodNumber>;
}, z.core.$strip>;
export declare function validateProviderConfig(config: unknown): KBOProviderConfig;
export declare function validateFactoryConfig(config: unknown): {
    type: "kbo-data" | "mock";
    apiKey?: string;
    baseUrl?: string;
    timeout?: number;
};
export declare function validateEnterpriseNumber(enterpriseNumber: string): void;
export declare function validateEstablishmentNumber(establishmentNumber: string): void;
export declare function formatEnterpriseNumber(enterpriseNumber: string): string;
export declare function formatEstablishmentNumber(establishmentNumber: string): string;
