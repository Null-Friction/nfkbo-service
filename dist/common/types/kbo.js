"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KBOCompanySchema = exports.NaceActivitySchema = exports.DenominationSchema = exports.AddressSchema = exports.EstablishmentSchema = exports.EnterpriseSchema = exports.JuridicalSituationSchema = exports.JuridicalFormSchema = exports.MultilingualTextSchema = exports.KBODenominationTypeSchema = exports.KBOEnterpriseTypeSchema = exports.KBOEntityTypeSchema = exports.KBOLanguageSchema = void 0;
const zod_1 = require("zod");
exports.KBOLanguageSchema = zod_1.z.enum(['unknown', 'nl', 'en', 'fr', 'de']);
exports.KBOEntityTypeSchema = zod_1.z.enum(['enterprise', 'establishment']);
exports.KBOEnterpriseTypeSchema = zod_1.z.enum(['natural', 'entity']);
exports.KBODenominationTypeSchema = zod_1.z.enum(['social', 'abbreviation', 'commercial']);
exports.MultilingualTextSchema = zod_1.z.object({
    nl: zod_1.z.string().optional(),
    fr: zod_1.z.string().optional(),
    de: zod_1.z.string().optional(),
    en: zod_1.z.string().optional(),
});
exports.JuridicalFormSchema = zod_1.z.object({
    code: zod_1.z.string(),
    description: exports.MultilingualTextSchema,
});
exports.JuridicalSituationSchema = zod_1.z.object({
    code: zod_1.z.string(),
    description: exports.MultilingualTextSchema,
    dateStart: zod_1.z.string(),
    dateEnd: zod_1.z.string().optional(),
});
exports.EnterpriseSchema = zod_1.z.object({
    enterpriseNumber: zod_1.z.string(),
    vatNumber: zod_1.z.string().optional(),
    active: zod_1.z.boolean(),
    type: exports.KBOEnterpriseTypeSchema,
    typeDescription: exports.MultilingualTextSchema,
    dateStart: zod_1.z.string(),
    dateEnd: zod_1.z.string().optional(),
    juridicalForm: exports.JuridicalFormSchema.optional(),
    juridicalSituation: exports.JuridicalSituationSchema.optional(),
});
exports.EstablishmentSchema = zod_1.z.object({
    enterpriseNumber: zod_1.z.string(),
    establishmentNumber: zod_1.z.string(),
    active: zod_1.z.boolean(),
    dateStart: zod_1.z.string(),
    dateEnd: zod_1.z.string().optional(),
});
exports.AddressSchema = zod_1.z.object({
    entityNumber: zod_1.z.string(),
    entityType: exports.KBOEntityTypeSchema,
    street: exports.MultilingualTextSchema,
    addressNumber: zod_1.z.string().optional(),
    boxNumber: zod_1.z.string().optional(),
    zipcode: zod_1.z.string(),
    city: exports.MultilingualTextSchema,
    countryCode: zod_1.z.string(),
    dateStart: zod_1.z.string(),
    dateEnd: zod_1.z.string().optional(),
});
exports.DenominationSchema = zod_1.z.object({
    entityNumber: zod_1.z.string(),
    entityType: exports.KBOEntityTypeSchema,
    language: exports.KBOLanguageSchema,
    value: zod_1.z.string(),
    type: exports.KBODenominationTypeSchema,
    typeDescription: exports.MultilingualTextSchema,
    dateStart: zod_1.z.string(),
    dateEnd: zod_1.z.string().optional(),
});
exports.NaceActivitySchema = zod_1.z.object({
    naceVersion: zod_1.z.number(),
    naceCode: zod_1.z.string(),
    description: exports.MultilingualTextSchema,
    classification: zod_1.z.string(),
    dateStart: zod_1.z.string(),
    dateEnd: zod_1.z.string().optional(),
});
exports.KBOCompanySchema = zod_1.z.object({
    number: zod_1.z.string(),
    name: zod_1.z.string(),
    address: zod_1.z.object({
        street: zod_1.z.string(),
        city: zod_1.z.string(),
        postalCode: zod_1.z.string(),
        country: zod_1.z.string(),
    }),
    status: zod_1.z.enum(['active', 'inactive', 'dissolved']),
    legalForm: zod_1.z.string(),
    establishmentDate: zod_1.z.string().optional(),
});
//# sourceMappingURL=kbo.js.map