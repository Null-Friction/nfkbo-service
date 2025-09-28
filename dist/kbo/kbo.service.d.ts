import { KBOCompany, EnterpriseComplete, EstablishmentComplete, KBOApiResponse, Enterprise, Establishment, EnterpriseSearchParams, EstablishmentSearchParams, KBOProvider } from '../types';
export declare class KboService {
    private readonly provider;
    constructor(provider: KBOProvider);
    searchByNumber(number: string): Promise<KBOCompany | null>;
    searchByName(name: string): Promise<KBOCompany[]>;
    getEnterprise(enterpriseNumber: string): Promise<EnterpriseComplete | null>;
    getEstablishment(establishmentNumber: string): Promise<EstablishmentComplete | null>;
    searchEnterprises(params: EnterpriseSearchParams): Promise<KBOApiResponse<Enterprise[]>>;
    searchEstablishments(params: EstablishmentSearchParams): Promise<KBOApiResponse<Establishment[]>>;
}
