import type { KBOProviderFactoryConfig, EnterpriseSearchParams, EstablishmentSearchParams } from '../providers';
export declare class KBOService {
    private provider;
    constructor(config?: KBOProviderFactoryConfig);
    getCompanyByNumber(enterpriseNumber: string): Promise<{
        number: string;
        name: string;
        address: {
            street: string;
            city: string;
            postalCode: string;
            country: string;
        };
        status: "active" | "inactive" | "dissolved";
        legalForm: string;
        establishmentDate?: string | undefined;
    } | null>;
    searchCompaniesByName(name: string): Promise<{
        number: string;
        name: string;
        address: {
            street: string;
            city: string;
            postalCode: string;
            country: string;
        };
        status: "active" | "inactive" | "dissolved";
        legalForm: string;
        establishmentDate?: string | undefined;
    }[]>;
    getEnterpriseDetails(enterpriseNumber: string): Promise<import("../providers").EnterpriseComplete | null>;
    getEstablishmentDetails(establishmentNumber: string): Promise<import("../providers").EstablishmentComplete | null>;
    searchEnterprises(params: EnterpriseSearchParams): Promise<import("../providers").KBOApiResponse<import("../providers").Enterprise[]>>;
    searchEstablishments(params: EstablishmentSearchParams): Promise<import("../providers").KBOApiResponse<import("../providers").Establishment[]>>;
    switchProvider(config: KBOProviderFactoryConfig): void;
    useMockProvider(): void;
    getProviderType(): string;
}
