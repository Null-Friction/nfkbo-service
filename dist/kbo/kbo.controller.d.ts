import { KboService } from './kbo.service';
import { KBOCompany, EnterpriseComplete, EstablishmentComplete, KBOApiResponse, Enterprise, Establishment, EnterpriseSearchParams, EstablishmentSearchParams } from '../common/types';
export declare class KboController {
    private readonly kboService;
    constructor(kboService: KboService);
    searchByNumber(number: string): Promise<KBOCompany | null>;
    searchByName(name: string): Promise<KBOCompany[]>;
    getEnterprise(enterpriseNumber: string): Promise<EnterpriseComplete | null>;
    getEstablishment(establishmentNumber: string): Promise<EstablishmentComplete | null>;
    searchEnterprises(params: EnterpriseSearchParams): Promise<KBOApiResponse<Enterprise[]>>;
    searchEstablishments(params: EstablishmentSearchParams): Promise<KBOApiResponse<Establishment[]>>;
}
