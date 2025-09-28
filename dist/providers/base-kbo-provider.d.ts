import { AxiosInstance } from 'axios';
import { KBOProvider, KBOProviderConfig, KBOCompany, EnterpriseComplete, EstablishmentComplete, KBOApiResponse, Enterprise, Establishment, EnterpriseSearchParams, EstablishmentSearchParams } from '@/types/kbo';
export declare abstract class BaseKBOProvider implements KBOProvider {
    protected client: AxiosInstance;
    protected config: KBOProviderConfig;
    constructor(config: KBOProviderConfig);
    abstract searchByNumber(number: string): Promise<KBOCompany | null>;
    abstract searchByName(name: string): Promise<KBOCompany[]>;
    abstract getEnterprise(enterpriseNumber: string): Promise<EnterpriseComplete | null>;
    abstract getEstablishment(establishmentNumber: string): Promise<EstablishmentComplete | null>;
    abstract searchEnterprises(params: EnterpriseSearchParams): Promise<KBOApiResponse<Enterprise[]>>;
    abstract searchEstablishments(params: EstablishmentSearchParams): Promise<KBOApiResponse<Establishment[]>>;
}
