"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.configSchema = void 0;
exports.validateConfig = validateConfig;
const zod_1 = require("zod");
exports.configSchema = zod_1.z.object({
    port: zod_1.z.coerce.number().default(3000),
    nodeEnv: zod_1.z.enum(['development', 'production', 'test']).default('development'),
    kbo: zod_1.z.object({
        apiKey: zod_1.z.string().optional(),
        useRealProvider: zod_1.z.coerce.boolean().default(true),
        baseUrl: zod_1.z.string().default('https://api.kbodata.app/v1'),
        timeout: zod_1.z.coerce.number().default(10000),
    }),
});
function validateConfig() {
    const config = {
        port: process.env.PORT,
        nodeEnv: process.env.NODE_ENV,
        kbo: {
            apiKey: process.env.KBO_API_KEY,
            useRealProvider: process.env.USE_REAL_KBO_PROVIDER !== 'false',
            baseUrl: process.env.KBO_API_BASE_URL,
            timeout: process.env.KBO_API_TIMEOUT,
        },
    };
    try {
        return exports.configSchema.parse(config);
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            const errors = error.issues.map(err => `${err.path.join('.')}: ${err.message}`).join('\n');
            throw new Error(`Configuration validation failed:\n${errors}`);
        }
        throw error;
    }
}
//# sourceMappingURL=configuration.js.map