import axios, { AxiosInstance } from 'axios';
import {
  KBOProvider,
  KBOProviderConfig,
  KBOCompany,
  EnterpriseComplete,
  EstablishmentComplete,
  KBOApiResponse,
  Enterprise,
  Establishment,
  EnterpriseSearchParams,
  EstablishmentSearchParams
} from '../types/kbo';

export abstract class BaseKBOProvider implements KBOProvider {
  protected client: AxiosInstance;
  protected config: KBOProviderConfig;

  constructor(config: KBOProviderConfig) {
    this.config = config;
    this.client = axios.create({
      baseURL: config.baseUrl,
      timeout: config.timeout || 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (config.apiKey) {
      this.client.defaults.headers.common['Authorization'] = `Bearer ${config.apiKey}`;
    }
  }

  abstract searchByNumber(number: string): Promise<KBOCompany | null>;
  abstract searchByName(name: string): Promise<KBOCompany[]>;
  abstract getEnterprise(enterpriseNumber: string): Promise<EnterpriseComplete | null>;
  abstract getEstablishment(establishmentNumber: string): Promise<EstablishmentComplete | null>;
  abstract searchEnterprises(params: EnterpriseSearchParams): Promise<KBOApiResponse<Enterprise[]>>;
  abstract searchEstablishments(params: EstablishmentSearchParams): Promise<KBOApiResponse<Establishment[]>>;
}