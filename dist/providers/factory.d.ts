import { KBOProvider, KBOProviderConfig } from '@/types/kbo';
export type KBOProviderType = 'kbo-data' | 'mock';
export interface KBOProviderFactoryConfig extends KBOProviderConfig {
    type: KBOProviderType;
}
export declare class KBOProviderFactory {
    private static providers;
    static createProvider(config: KBOProviderFactoryConfig): KBOProvider;
    static clearCache(): void;
    static getDefaultProvider(): KBOProvider;
    static getMockProvider(): KBOProvider;
}
