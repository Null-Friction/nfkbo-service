import { z } from 'zod';
import { KBOProviderConfig } from '@/types/kbo';
import { KBOConfigurationError } from './errors';

export const KBOProviderConfigSchema = z.object({
  apiKey: z.string().optional(),
  baseUrl: z.string().url().optional(),
  timeout: z.number().positive().max(60000).optional(),
});

export const KBOProviderFactoryConfigSchema = z.object({
  type: z.enum(['kbo-data', 'mock']),
  apiKey: z.string().optional(),
  baseUrl: z.string().url().optional(),
  timeout: z.number().positive().max(60000).optional(),
});

export function validateProviderConfig(config: unknown): KBOProviderConfig {
  try {
    return KBOProviderConfigSchema.parse(config);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessages = error.issues.map((err: any) => `${err.path.join('.')}: ${err.message}`);
      throw new KBOConfigurationError(
        `Invalid provider configuration: ${errorMessages.join(', ')}`,
        { validationErrors: error.issues }
      );
    }
    throw new KBOConfigurationError('Invalid provider configuration', error);
  }
}

export function validateFactoryConfig(config: unknown) {
  try {
    return KBOProviderFactoryConfigSchema.parse(config);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessages = error.issues.map((err: any) => `${err.path.join('.')}: ${err.message}`);
      throw new KBOConfigurationError(
        `Invalid factory configuration: ${errorMessages.join(', ')}`,
        { validationErrors: error.issues }
      );
    }
    throw new KBOConfigurationError('Invalid factory configuration', error);
  }
}

export function validateEnterpriseNumber(enterpriseNumber: string): void {
  if (!enterpriseNumber || typeof enterpriseNumber !== 'string') {
    throw new KBOConfigurationError('Enterprise number must be a non-empty string');
  }

  // Remove spaces and dots for validation
  const cleanNumber = enterpriseNumber.replace(/[\s.]/g, '');

  // Check if it's exactly 10 digits
  if (!/^\d{10}$/.test(cleanNumber)) {
    throw new KBOConfigurationError('Enterprise number must be exactly 10 digits');
  }

  // Validate check digits using mod 97 algorithm
  const firstEightDigits = cleanNumber.substring(0, 8);
  const checkDigits = cleanNumber.substring(8, 10);

  const remainder = parseInt(firstEightDigits) % 97;
  const expectedCheckDigits = 97 - remainder;

  if (parseInt(checkDigits) !== expectedCheckDigits) {
    throw new KBOConfigurationError('Invalid enterprise number check digits');
  }
}

export function validateEstablishmentNumber(establishmentNumber: string): void {
  if (!establishmentNumber || typeof establishmentNumber !== 'string') {
    throw new KBOConfigurationError('Establishment number must be a non-empty string');
  }

  // Remove spaces and dots for validation
  const cleanNumber = establishmentNumber.replace(/[\s.]/g, '');

  // Check if it's exactly 10 digits and starts with 2
  if (!/^2\d{9}$/.test(cleanNumber)) {
    throw new KBOConfigurationError('Establishment number must be exactly 10 digits starting with 2');
  }

  // Validate check digits using mod 97 algorithm
  const firstEightDigits = cleanNumber.substring(0, 8);
  const checkDigits = cleanNumber.substring(8, 10);

  const remainder = parseInt(firstEightDigits) % 97;
  const expectedCheckDigits = 97 - remainder;

  if (parseInt(checkDigits) !== expectedCheckDigits) {
    throw new KBOConfigurationError('Invalid establishment number check digits');
  }
}

export function formatEnterpriseNumber(enterpriseNumber: string): string {
  const cleanNumber = enterpriseNumber.replace(/[\s.]/g, '');
  validateEnterpriseNumber(cleanNumber);

  // Format as 0XXX.XXX.XXX
  return `${cleanNumber.substring(0, 4)}.${cleanNumber.substring(4, 7)}.${cleanNumber.substring(7, 10)}`;
}

export function formatEstablishmentNumber(establishmentNumber: string): string {
  const cleanNumber = establishmentNumber.replace(/[\s.]/g, '');
  validateEstablishmentNumber(cleanNumber);

  // Format as 2.XXX.XXX.XXX
  return `${cleanNumber.substring(0, 1)}.${cleanNumber.substring(1, 4)}.${cleanNumber.substring(4, 7)}.${cleanNumber.substring(7, 10)}`;
}