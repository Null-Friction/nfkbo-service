import { Injectable } from '@nestjs/common';
import { KBODataProvider } from '../providers/kbo-data-provider';
import { MockKBOProvider } from '../providers/mock-kbo-provider';
import {
  KBOCompany,
  EnterpriseComplete,
  EstablishmentComplete,
  KBOApiResponse,
  Enterprise,
  Establishment,
  EnterpriseSearchParams,
  EstablishmentSearchParams,
  KBOProvider,
} from '../types';

@Injectable()
export class KboService {
  private provider: KBOProvider;

  constructor() {
    // Initialize with the real KBO provider
    // You can make this configurable via environment variables
    const useRealProvider = process.env.USE_REAL_KBO_PROVIDER !== 'false';

    if (useRealProvider) {
      this.provider = new KBODataProvider({
        apiKey: process.env.KBO_API_KEY,
      });
    } else {
      this.provider = new MockKBOProvider({});
    }
  }

  async searchByNumber(number: string): Promise<KBOCompany | null> {
    return this.provider.searchByNumber(number);
  }

  async searchByName(name: string): Promise<KBOCompany[]> {
    return this.provider.searchByName(name);
  }

  async getEnterprise(enterpriseNumber: string): Promise<EnterpriseComplete | null> {
    return this.provider.getEnterprise(enterpriseNumber);
  }

  async getEstablishment(establishmentNumber: string): Promise<EstablishmentComplete | null> {
    return this.provider.getEstablishment(establishmentNumber);
  }

  async searchEnterprises(params: EnterpriseSearchParams): Promise<KBOApiResponse<Enterprise[]>> {
    return this.provider.searchEnterprises(params);
  }

  async searchEstablishments(params: EstablishmentSearchParams): Promise<KBOApiResponse<Establishment[]>> {
    return this.provider.searchEstablishments(params);
  }
}