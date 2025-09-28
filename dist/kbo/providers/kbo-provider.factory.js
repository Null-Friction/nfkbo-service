"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createKBOProvider = createKBOProvider;
const common_1 = require("@nestjs/common");
const factory_1 = require("../../common/providers/factory");
const config_validator_1 = require("../../common/providers/config-validator");
async function createKBOProvider(configService) {
    const logger = new common_1.Logger('KBOProviderFactory');
    try {
        const providerType = configService.useRealKboProvider ? 'kbo-data' : 'mock';
        const providerConfig = {
            type: providerType,
            apiKey: configService.kboApiKey,
            baseUrl: configService.kboApiBaseUrl,
            timeout: configService.kboApiTimeout,
            useRealProvider: configService.useRealKboProvider,
        };
        if (providerType === 'kbo-data') {
            (0, config_validator_1.validateProviderConfig)(providerConfig);
            logger.log('Using real KBO data provider');
        }
        else {
            logger.log('Using mock KBO provider');
        }
        const provider = factory_1.KBOProviderFactory.createProvider({
            type: providerConfig.type,
            apiKey: providerConfig.apiKey,
            baseUrl: providerConfig.baseUrl,
            timeout: providerConfig.timeout,
        });
        if (providerType === 'kbo-data') {
            await performHealthCheck(provider, logger);
        }
        logger.log(`KBO provider initialized successfully: ${providerType}`);
        return provider;
    }
    catch (error) {
        logger.error('Failed to create KBO provider', error);
        if (configService.useRealKboProvider) {
            logger.warn('Falling back to mock provider due to initialization failure');
            return factory_1.KBOProviderFactory.createProvider({ type: 'mock' });
        }
        throw error;
    }
}
async function performHealthCheck(provider, logger) {
    try {
        await provider.searchByNumber('0776834537');
        logger.log('Provider health check passed');
    }
    catch (error) {
        logger.warn('Provider health check failed, but continuing anyway', error);
    }
}
//# sourceMappingURL=kbo-provider.factory.js.map