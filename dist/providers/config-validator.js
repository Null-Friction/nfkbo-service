"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KBOProviderFactoryConfigSchema = exports.KBOProviderConfigSchema = void 0;
exports.validateProviderConfig = validateProviderConfig;
exports.validateFactoryConfig = validateFactoryConfig;
exports.validateEnterpriseNumber = validateEnterpriseNumber;
exports.validateEstablishmentNumber = validateEstablishmentNumber;
exports.formatEnterpriseNumber = formatEnterpriseNumber;
exports.formatEstablishmentNumber = formatEstablishmentNumber;
const zod_1 = require("zod");
const errors_1 = require("./errors");
exports.KBOProviderConfigSchema = zod_1.z.object({
    apiKey: zod_1.z.string().optional(),
    baseUrl: zod_1.z.string().url().optional(),
    timeout: zod_1.z.number().positive().max(60000).optional(),
});
exports.KBOProviderFactoryConfigSchema = zod_1.z.object({
    type: zod_1.z.enum(['kbo-data', 'mock']),
    apiKey: zod_1.z.string().optional(),
    baseUrl: zod_1.z.string().url().optional(),
    timeout: zod_1.z.number().positive().max(60000).optional(),
});
function validateProviderConfig(config) {
    try {
        return exports.KBOProviderConfigSchema.parse(config);
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            const errorMessages = error.issues.map((err) => `${err.path.join('.')}: ${err.message}`);
            throw new errors_1.KBOConfigurationError(`Invalid provider configuration: ${errorMessages.join(', ')}`, { validationErrors: error.issues });
        }
        throw new errors_1.KBOConfigurationError('Invalid provider configuration', error);
    }
}
function validateFactoryConfig(config) {
    try {
        return exports.KBOProviderFactoryConfigSchema.parse(config);
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            const errorMessages = error.issues.map((err) => `${err.path.join('.')}: ${err.message}`);
            throw new errors_1.KBOConfigurationError(`Invalid factory configuration: ${errorMessages.join(', ')}`, { validationErrors: error.issues });
        }
        throw new errors_1.KBOConfigurationError('Invalid factory configuration', error);
    }
}
function validateEnterpriseNumber(enterpriseNumber) {
    if (!enterpriseNumber || typeof enterpriseNumber !== 'string') {
        throw new errors_1.KBOConfigurationError('Enterprise number must be a non-empty string');
    }
    const cleanNumber = enterpriseNumber.replace(/[\s.]/g, '');
    if (!/^\d{10}$/.test(cleanNumber)) {
        throw new errors_1.KBOConfigurationError('Enterprise number must be exactly 10 digits');
    }
    const firstEightDigits = cleanNumber.substring(0, 8);
    const checkDigits = cleanNumber.substring(8, 10);
    const remainder = parseInt(firstEightDigits) % 97;
    const expectedCheckDigits = 97 - remainder;
    if (parseInt(checkDigits) !== expectedCheckDigits) {
        throw new errors_1.KBOConfigurationError('Invalid enterprise number check digits');
    }
}
function validateEstablishmentNumber(establishmentNumber) {
    if (!establishmentNumber || typeof establishmentNumber !== 'string') {
        throw new errors_1.KBOConfigurationError('Establishment number must be a non-empty string');
    }
    const cleanNumber = establishmentNumber.replace(/[\s.]/g, '');
    if (!/^2\d{9}$/.test(cleanNumber)) {
        throw new errors_1.KBOConfigurationError('Establishment number must be exactly 10 digits starting with 2');
    }
    const firstEightDigits = cleanNumber.substring(0, 8);
    const checkDigits = cleanNumber.substring(8, 10);
    const remainder = parseInt(firstEightDigits) % 97;
    const expectedCheckDigits = 97 - remainder;
    if (parseInt(checkDigits) !== expectedCheckDigits) {
        throw new errors_1.KBOConfigurationError('Invalid establishment number check digits');
    }
}
function formatEnterpriseNumber(enterpriseNumber) {
    const cleanNumber = enterpriseNumber.replace(/[\s.]/g, '');
    validateEnterpriseNumber(cleanNumber);
    return `${cleanNumber.substring(0, 4)}.${cleanNumber.substring(4, 7)}.${cleanNumber.substring(7, 10)}`;
}
function formatEstablishmentNumber(establishmentNumber) {
    const cleanNumber = establishmentNumber.replace(/[\s.]/g, '');
    validateEstablishmentNumber(cleanNumber);
    return `${cleanNumber.substring(0, 1)}.${cleanNumber.substring(1, 4)}.${cleanNumber.substring(4, 7)}.${cleanNumber.substring(7, 10)}`;
}
//# sourceMappingURL=config-validator.js.map