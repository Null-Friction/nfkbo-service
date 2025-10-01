import { ConfigService as NestConfigService } from '@nestjs/config';
import { AppConfig } from './configuration';
export declare class AppConfigService {
    private readonly configService;
    constructor(configService: NestConfigService<AppConfig, true>);
    get port(): number;
    get nodeEnv(): string;
    get kboApiKey(): string | undefined;
    get useRealKboProvider(): boolean;
    get kboApiBaseUrl(): string;
    get kboApiTimeout(): number;
    get isDevelopment(): boolean;
    get isProduction(): boolean;
    get isTest(): boolean;
    get lookupKeySecret(): string;
}
