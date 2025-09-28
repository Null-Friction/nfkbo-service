import { KBOProviderFactory, KBOProvider } from '../providers';
import type {
  KBOProviderFactoryConfig,
  EnterpriseSearchParams,
  EstablishmentSearchParams
} from '../providers';

export class KBOService {
  private provider: KBOProvider;

  constructor(config?: KBOProviderFactoryConfig) {
    this.provider = config
      ? KBOProviderFactory.createProvider(config)
      : KBOProviderFactory.getDefaultProvider();
  }

  // Convenience methods that delegate to the provider
  async getCompanyByNumber(enterpriseNumber: string) {
    return this.provider.searchByNumber(enterpriseNumber);
  }

  async searchCompaniesByName(name: string) {
    return this.provider.searchByName(name);
  }

  async getEnterpriseDetails(enterpriseNumber: string) {
    return this.provider.getEnterprise(enterpriseNumber);
  }

  async getEstablishmentDetails(establishmentNumber: string) {
    return this.provider.getEstablishment(establishmentNumber);
  }

  async searchEnterprises(params: EnterpriseSearchParams) {
    return this.provider.searchEnterprises(params);
  }

  async searchEstablishments(params: EstablishmentSearchParams) {
    return this.provider.searchEstablishments(params);
  }

  // Method to switch providers at runtime
  switchProvider(config: KBOProviderFactoryConfig) {
    this.provider = KBOProviderFactory.createProvider(config);
  }

  // Convenience method to switch to mock provider for testing
  useMockProvider() {
    this.provider = KBOProviderFactory.getMockProvider();
  }

  // Get current provider type (useful for debugging)
  getProviderType(): string {
    return this.provider.constructor.name;
  }
}