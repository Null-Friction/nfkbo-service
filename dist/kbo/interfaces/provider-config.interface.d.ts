import { KBOProviderType } from '../../common/providers/factory';
export interface KBOProviderDIConfig {
    type: KBOProviderType;
    apiKey?: string;
    baseUrl?: string;
    timeout?: number;
    useRealProvider?: boolean;
}
export interface KBOProviderFactoryDIConfig extends KBOProviderDIConfig {
    validateConfig?: boolean;
    enableHealthCheck?: boolean;
}
