import { Injectable, Inject } from '@nestjs/common';
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
} from '../common/types';
import { KBO_PROVIDER_TOKEN } from './tokens';

@Injectable()
export class KboService {
  constructor(
    @Inject(KBO_PROVIDER_TOKEN) private readonly provider: KBOProvider
  ) {}

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