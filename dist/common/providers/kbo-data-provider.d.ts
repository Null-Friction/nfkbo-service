import { KBOCompany, EnterpriseComplete, EstablishmentComplete, KBOApiResponse, Enterprise, Establishment, EnterpriseSearchParams, EstablishmentSearchParams, KBOProviderConfig } from '../types/kbo';
import { BaseKBOProvider } from './base-kbo-provider';
export declare class KBODataProvider extends BaseKBOProvider {
    constructor(config: KBOProviderConfig);
    searchByNumber(number: string): Promise<KBOCompany | null>;
    searchByName(name: string): Promise<KBOCompany[]>;
    getEnterprise(enterpriseNumber: string): Promise<EnterpriseComplete | null>;
    getEstablishment(establishmentNumber: string): Promise<EstablishmentComplete | null>;
    searchEnterprises(params: EnterpriseSearchParams): Promise<KBOApiResponse<Enterprise[]>>;
    searchEstablishments(params: EstablishmentSearchParams): Promise<KBOApiResponse<Establishment[]>>;
}
