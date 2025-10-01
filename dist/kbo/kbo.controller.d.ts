import { KBOCompany, EnterpriseComplete, EstablishmentComplete, KBOApiResponse, Enterprise, Establishment } from '../common/types';
import { SearchByNumberDto, SearchByNameDto, GetEnterpriseDto, SearchByEstablishmentNumberDto, EnterpriseSearchDto, EstablishmentSearchDto } from './dto';
import { KboService } from './kbo.service';
export declare class KboController {
    private readonly kboService;
    constructor(kboService: KboService);
    searchByNumber(params: SearchByNumberDto): Promise<KBOCompany | null>;
    searchByName(query: SearchByNameDto): Promise<KBOCompany[]>;
    getEnterprise(params: GetEnterpriseDto): Promise<EnterpriseComplete | null>;
    getEstablishment(params: SearchByEstablishmentNumberDto): Promise<EstablishmentComplete | null>;
    searchEnterprises(params: EnterpriseSearchDto): Promise<KBOApiResponse<Enterprise[]>>;
    searchEstablishments(params: EstablishmentSearchDto): Promise<KBOApiResponse<Establishment[]>>;
}
