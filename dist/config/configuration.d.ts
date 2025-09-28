import { z } from 'zod';
export declare const configSchema: z.ZodObject<{
    port: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    nodeEnv: z.ZodDefault<z.ZodEnum<{
        development: "development";
        production: "production";
        test: "test";
    }>>;
    kbo: z.ZodObject<{
        apiKey: z.ZodOptional<z.ZodString>;
        useRealProvider: z.ZodDefault<z.ZodCoercedBoolean<unknown>>;
        baseUrl: z.ZodDefault<z.ZodString>;
        timeout: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    }, z.core.$strip>;
}, z.core.$strip>;
export type AppConfig = z.infer<typeof configSchema>;
export declare function validateConfig(): AppConfig;
