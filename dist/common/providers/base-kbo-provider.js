"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseKBOProvider = void 0;
const axios_1 = require("axios");
class BaseKBOProvider {
    constructor(config) {
        this.config = config;
        this.client = axios_1.default.create({
            baseURL: config.baseUrl,
            timeout: config.timeout || 10000,
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (config.apiKey) {
            this.client.defaults.headers.common['Authorization'] = `Bearer ${config.apiKey}`;
        }
    }
}
exports.BaseKBOProvider = BaseKBOProvider;
//# sourceMappingURL=base-kbo-provider.js.map