"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KBODataProvider = void 0;
const base_kbo_provider_1 = require("./base-kbo-provider");
const kbo_1 = require("../types/kbo");
const errors_1 = require("./errors");
class KBODataProvider extends base_kbo_provider_1.BaseKBOProvider {
    constructor(config) {
        const defaultConfig = {
            baseUrl: 'https://api.kbodata.app/v1',
            timeout: 10000,
            ...config,
        };
        super(defaultConfig);
    }
    async searchByNumber(number) {
        try {
            if (!number?.trim()) {
                throw new errors_1.KBOValidationError('Enterprise number is required');
            }
            const enterprise = await this.getEnterprise(number);
            if (!enterprise) {
                return null;
            }
            const primaryAddress = enterprise.addresses[0];
            const primaryDenomination = enterprise.denominations.find(d => d.type === 'social')
                || enterprise.denominations[0];
            return {
                number: enterprise.enterpriseNumber,
                name: primaryDenomination?.value || '',
                address: {
                    street: primaryAddress?.street.nl || primaryAddress?.street.fr || '',
                    city: primaryAddress?.city.nl || primaryAddress?.city.fr || '',
                    postalCode: primaryAddress?.zipcode || '',
                    country: primaryAddress?.countryCode || 'BE',
                },
                status: enterprise.active ? 'active' : 'inactive',
                legalForm: enterprise.juridicalForm?.description.nl || enterprise.juridicalForm?.description.fr || '',
                establishmentDate: enterprise.dateStart,
            };
        }
        catch (error) {
            if (error instanceof errors_1.KBOValidationError) {
                throw error;
            }
            (0, errors_1.handleHttpError)(error);
        }
    }
    async searchByName(name) {
        try {
            if (!name?.trim()) {
                throw new errors_1.KBOValidationError('Company name is required');
            }
            const response = await this.searchEnterprises({
                denomination: name,
                limit: 50,
            });
            return Promise.all(response.data.map(async (enterprise) => {
                const company = await this.searchByNumber(enterprise.enterpriseNumber);
                return company;
            }));
        }
        catch (error) {
            if (error instanceof errors_1.KBOValidationError) {
                throw error;
            }
            (0, errors_1.handleHttpError)(error);
        }
    }
    async getEnterprise(enterpriseNumber) {
        try {
            if (!enterpriseNumber?.trim()) {
                throw new errors_1.KBOValidationError('Enterprise number is required');
            }
            const [enterpriseResponse, denominationsResponse, addressesResponse, establishmentsResponse, activitiesResponse] = await Promise.allSettled([
                this.client.get(`/enterprises/${enterpriseNumber}`),
                this.client.get(`/enterprises/${enterpriseNumber}/denominations`),
                this.client.get(`/enterprises/${enterpriseNumber}/addresses`),
                this.client.get(`/enterprises/${enterpriseNumber}/establishments`),
                this.client.get(`/enterprises/${enterpriseNumber}/activities`)
            ]);
            if (enterpriseResponse.status === 'rejected') {
                if (enterpriseResponse.reason?.response?.status === 404) {
                    return null;
                }
                (0, errors_1.handleHttpError)(enterpriseResponse.reason);
            }
            const enterprise = kbo_1.EnterpriseSchema.parse(enterpriseResponse.value.data);
            const denominations = denominationsResponse.status === 'fulfilled'
                ? denominationsResponse.value.data.map((d) => kbo_1.DenominationSchema.parse(d))
                : [];
            const addresses = addressesResponse.status === 'fulfilled'
                ? addressesResponse.value.data.map((a) => kbo_1.AddressSchema.parse(a))
                : [];
            const establishments = establishmentsResponse.status === 'fulfilled'
                ? establishmentsResponse.value.data.map((e) => kbo_1.EstablishmentSchema.parse(e))
                : [];
            const activities = activitiesResponse.status === 'fulfilled'
                ? activitiesResponse.value.data.map((a) => kbo_1.NaceActivitySchema.parse(a))
                : [];
            return {
                ...enterprise,
                denominations,
                addresses,
                establishments,
                activities,
            };
        }
        catch (error) {
            if (error instanceof errors_1.KBOValidationError) {
                throw error;
            }
            (0, errors_1.handleHttpError)(error);
        }
    }
    async getEstablishment(establishmentNumber) {
        try {
            if (!establishmentNumber?.trim()) {
                throw new errors_1.KBOValidationError('Establishment number is required');
            }
            const [establishmentResponse, denominationsResponse, addressesResponse, activitiesResponse] = await Promise.allSettled([
                this.client.get(`/establishments/${establishmentNumber}`),
                this.client.get(`/establishments/${establishmentNumber}/denominations`),
                this.client.get(`/establishments/${establishmentNumber}/addresses`),
                this.client.get(`/establishments/${establishmentNumber}/activities`)
            ]);
            if (establishmentResponse.status === 'rejected') {
                if (establishmentResponse.reason?.response?.status === 404) {
                    return null;
                }
                (0, errors_1.handleHttpError)(establishmentResponse.reason);
            }
            const establishment = kbo_1.EstablishmentSchema.parse(establishmentResponse.value.data);
            const denominations = denominationsResponse.status === 'fulfilled'
                ? denominationsResponse.value.data.map((d) => kbo_1.DenominationSchema.parse(d))
                : [];
            const addresses = addressesResponse.status === 'fulfilled'
                ? addressesResponse.value.data.map((a) => kbo_1.AddressSchema.parse(a))
                : [];
            const activities = activitiesResponse.status === 'fulfilled'
                ? activitiesResponse.value.data.map((a) => kbo_1.NaceActivitySchema.parse(a))
                : [];
            return {
                ...establishment,
                denominations,
                addresses,
                activities,
            };
        }
        catch (error) {
            if (error instanceof errors_1.KBOValidationError) {
                throw error;
            }
            (0, errors_1.handleHttpError)(error);
        }
    }
    async searchEnterprises(params) {
        try {
            const queryParams = new URLSearchParams();
            Object.entries(params).forEach(([key, value]) => {
                if (value !== undefined && value !== null) {
                    queryParams.append(key, String(value));
                }
            });
            const response = await this.client.get(`/enterprises?${queryParams.toString()}`);
            const enterprises = response.data.data.map((e) => kbo_1.EnterpriseSchema.parse(e));
            return {
                data: enterprises,
                meta: response.data.meta || {
                    totalItems: enterprises.length,
                    itemsPerPage: params.limit || 20,
                    currentPage: params.page || 1,
                    totalPages: Math.ceil(enterprises.length / (params.limit || 20)),
                },
            };
        }
        catch (error) {
            (0, errors_1.handleHttpError)(error);
        }
    }
    async searchEstablishments(params) {
        try {
            const queryParams = new URLSearchParams();
            Object.entries(params).forEach(([key, value]) => {
                if (value !== undefined && value !== null) {
                    queryParams.append(key, String(value));
                }
            });
            const response = await this.client.get(`/establishments?${queryParams.toString()}`);
            const establishments = response.data.data.map((e) => kbo_1.EstablishmentSchema.parse(e));
            return {
                data: establishments,
                meta: response.data.meta || {
                    totalItems: establishments.length,
                    itemsPerPage: params.limit || 20,
                    currentPage: params.page || 1,
                    totalPages: Math.ceil(establishments.length / (params.limit || 20)),
                },
            };
        }
        catch (error) {
            (0, errors_1.handleHttpError)(error);
        }
    }
}
exports.KBODataProvider = KBODataProvider;
//# sourceMappingURL=kbo-data-provider.js.map