import { z } from 'zod';

export const configSchema = z.object({
  port: z.coerce.number().default(3000),
  nodeEnv: z.enum(['development', 'production', 'test']).default('development'),
  database: z.object({
    host: z.string().default('localhost'),
    port: z.coerce.number().default(5432),
    username: z.string().default('postgres'),
    password: z.string(),
    database: z.string().default('nfkbo'),
    synchronize: z.coerce.boolean().default(false),
    logging: z.coerce.boolean().default(false),
  }),
  auth: z.object({
    bootstrapApiKey: z.string().optional(),
    rateLimitWindowMs: z.coerce.number().default(60000),
  }),
  kbo: z.object({
    apiKey: z.string().optional(),
    useRealProvider: z.coerce.boolean().default(true),
    baseUrl: z.string().default('https://api.kbodata.app/v1'),
    timeout: z.coerce.number().default(10000),
  }),
});

export type AppConfig = z.infer<typeof configSchema>;

export function validateConfig(): AppConfig {
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
    return configSchema.parse(config);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = error.issues.map(err => `${err.path.join('.')}: ${err.message}`).join('\n');
      throw new Error(`Configuration validation failed:\n${errors}`);
    }
    throw error;
  }
}