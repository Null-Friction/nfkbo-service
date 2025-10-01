"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KBOProviderFactory = void 0;
const kbo_data_provider_1 = require("./kbo-data-provider");
const mock_kbo_provider_1 = require("./mock-kbo-provider");
class KBOProviderFactory {
    static createProvider(config) {
        const cacheKey = `${config.type}_${config.baseUrl || 'default'}`;
        if (this.providers.has(cacheKey)) {
            return this.providers.get(cacheKey);
        }
        let provider;
        switch (config.type) {
            case 'kbo-data':
                provider = new kbo_data_provider_1.KBODataProvider(config);
                break;
            case 'mock':
                provider = new mock_kbo_provider_1.MockKBOProvider(config);
                break;
            default: {
                const exhaustiveCheck = config.type;
                throw new Error(`Unknown provider type: ${exhaustiveCheck}`);
            }
        }
        this.providers.set(cacheKey, provider);
        return provider;
    }
    static clearCache() {
        this.providers.clear();
    }
    static getDefaultProvider() {
        return this.createProvider({
            type: 'kbo-data',
            baseUrl: 'https://api.kbodata.app/v1',
            timeout: 10000,
        });
    }
    static getMockProvider() {
        return this.createProvider({
            type: 'mock',
        });
    }
}
exports.KBOProviderFactory = KBOProviderFactory;
KBOProviderFactory.providers = new Map();
//# sourceMappingURL=factory.js.map