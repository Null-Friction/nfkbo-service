import { z } from 'zod';
export declare const configSchema: z.ZodObject<{
    port: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    nodeEnv: z.ZodDefault<z.ZodEnum<{
        development: "development";
        production: "production";
        test: "test";
    }>>;
    database: z.ZodObject<{
        host: z.ZodDefault<z.ZodString>;
        port: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
        username: z.ZodDefault<z.ZodString>;
        password: z.ZodString;
        database: z.ZodDefault<z.ZodString>;
        synchronize: z.ZodDefault<z.ZodCoercedBoolean<unknown>>;
        logging: z.ZodDefault<z.ZodCoercedBoolean<unknown>>;
    }, z.core.$strip>;
    auth: z.ZodObject<{
        bootstrapApiKey: z.ZodOptional<z.ZodString>;
        rateLimitWindowMs: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
        lookupKeySecret: z.ZodString;
    }, z.core.$strip>;
    kbo: z.ZodObject<{
        apiKey: z.ZodOptional<z.ZodString>;
        useRealProvider: z.ZodDefault<z.ZodCoercedBoolean<unknown>>;
        baseUrl: z.ZodDefault<z.ZodString>;
        timeout: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    }, z.core.$strip>;
}, z.core.$strip>;
export type AppConfig = z.infer<typeof configSchema>;
export declare function validateConfig(): AppConfig;
