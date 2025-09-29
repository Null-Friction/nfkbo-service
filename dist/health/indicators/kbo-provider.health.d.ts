import { HealthIndicator, HealthIndicatorResult } from '@nestjs/terminus';
import { AppConfigService } from '../../config/config.service';
export declare class KboProviderHealthIndicator extends HealthIndicator {
    private readonly configService;
    constructor(configService: AppConfigService);
    isHealthy(key: string): Promise<HealthIndicatorResult>;
    private checkKboProviderHealth;
    private validateKboConfiguration;
    private isValidUrl;
}
