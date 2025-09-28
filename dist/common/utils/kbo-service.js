"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KBOService = void 0;
const providers_1 = require("../providers");
class KBOService {
    constructor(config) {
        this.provider = config
            ? providers_1.KBOProviderFactory.createProvider(config)
            : providers_1.KBOProviderFactory.getDefaultProvider();
    }
    async getCompanyByNumber(enterpriseNumber) {
        return this.provider.searchByNumber(enterpriseNumber);
    }
    async searchCompaniesByName(name) {
        return this.provider.searchByName(name);
    }
    async getEnterpriseDetails(enterpriseNumber) {
        return this.provider.getEnterprise(enterpriseNumber);
    }
    async getEstablishmentDetails(establishmentNumber) {
        return this.provider.getEstablishment(establishmentNumber);
    }
    async searchEnterprises(params) {
        return this.provider.searchEnterprises(params);
    }
    async searchEstablishments(params) {
        return this.provider.searchEstablishments(params);
    }
    switchProvider(config) {
        this.provider = providers_1.KBOProviderFactory.createProvider(config);
    }
    useMockProvider() {
        this.provider = providers_1.KBOProviderFactory.getMockProvider();
    }
    getProviderType() {
        return this.provider.constructor.name;
    }
}
exports.KBOService = KBOService;
//# sourceMappingURL=kbo-service.js.map