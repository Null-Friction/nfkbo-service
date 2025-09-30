"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.configSchema = void 0;
exports.validateConfig = validateConfig;
const zod_1 = require("zod");
exports.configSchema = zod_1.z.object({
    port: zod_1.z.coerce.number().default(3000),
    nodeEnv: zod_1.z.enum(['development', 'production', 'test']).default('development'),
    database: zod_1.z.object({
        host: zod_1.z.string().default('localhost'),
        port: zod_1.z.coerce.number().default(5432),
        username: zod_1.z.string().default('postgres'),
        password: zod_1.z.string(),
        database: zod_1.z.string().default('nfkbo'),
        synchronize: zod_1.z.coerce.boolean().default(false),
        logging: zod_1.z.coerce.boolean().default(false),
    }),
    auth: zod_1.z.object({
        bootstrapApiKey: zod_1.z.string().optional(),
        rateLimitWindowMs: zod_1.z.coerce.number().default(60000),
    }),
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
        database: {
            host: process.env.DB_HOST,
            port: process.env.DB_PORT,
            username: process.env.DB_USERNAME,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_DATABASE,
            synchronize: process.env.DB_SYNCHRONIZE,
            logging: process.env.DB_LOGGING,
        },
        auth: {
            bootstrapApiKey: process.env.BOOTSTRAP_API_KEY,
            rateLimitWindowMs: process.env.RATE_LIMIT_WINDOW_MS,
        },
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