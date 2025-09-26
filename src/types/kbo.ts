import { z } from 'zod';

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

export interface KBOProvider {
  searchByNumber(number: string): Promise<KBOCompany | null>;
  searchByName(name: string): Promise<KBOCompany[]>;
}

export interface KBOProviderConfig {
  apiKey?: string;
  baseUrl?: string;
  timeout?: number;
}