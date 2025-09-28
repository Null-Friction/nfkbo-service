import {
  KBOCompany,
  EnterpriseComplete,
  EstablishmentComplete,
  KBOApiResponse,
  Enterprise,
  Establishment,
  EnterpriseSearchParams,
  EstablishmentSearchParams,
  KBOProviderConfig,
  Address,
  Denomination,
  NaceActivity
} from '../types/kbo';
import { BaseKBOProvider } from './base-kbo-provider';
import { KBOValidationError, KBONotFoundError } from './errors';

export class MockKBOProvider extends BaseKBOProvider {
  private mockData: {
    enterprises: EnterpriseComplete[];
    establishments: EstablishmentComplete[];
  };

  constructor(config: KBOProviderConfig = {}) {
    super(config);
    this.mockData = this.generateMockData();
  }

  private generateMockData() {
    const mockEnterprises: EnterpriseComplete[] = [
      {
        enterpriseNumber: '0123456789',
        vatNumber: 'BE0123456789',
        active: true,
        type: 'entity',
        typeDescription: {
          nl: 'Rechtspersoon',
          fr: 'Personne morale',
          en: 'Legal entity'
        },
        dateStart: '2020-01-15',
        juridicalForm: {
          code: '001',
          description: {
            nl: 'Besloten vennootschap',
            fr: 'Société privée à responsabilité limitée',
            en: 'Private limited company'
          }
        },
        juridicalSituation: {
          code: '000',
          description: {
            nl: 'Normale toestand',
            fr: 'Situation normale',
            en: 'Normal situation'
          },
          dateStart: '2020-01-15'
        },
        denominations: [
          {
            entityNumber: '0123456789',
            entityType: 'enterprise',
            language: 'nl',
            value: 'Mock Tech Solutions BV',
            type: 'social',
            typeDescription: {
              nl: 'Maatschappelijke benaming',
              fr: 'Dénomination sociale',
              en: 'Corporate name'
            },
            dateStart: '2020-01-15'
          }
        ],
        addresses: [
          {
            entityNumber: '0123456789',
            entityType: 'enterprise',
            street: {
              nl: 'Teststraat 123',
              fr: 'Rue de Test 123'
            },
            addressNumber: '123',
            zipcode: '1000',
            city: {
              nl: 'Brussel',
              fr: 'Bruxelles',
              en: 'Brussels'
            },
            countryCode: 'BE',
            dateStart: '2020-01-15'
          }
        ],
        establishments: [
          {
            enterpriseNumber: '0123456789',
            establishmentNumber: '2123456789',
            active: true,
            dateStart: '2020-01-15'
          }
        ],
        activities: [
          {
            naceVersion: 2008,
            naceCode: '62010',
            description: {
              nl: 'Ontwikkeling van computerprogramma\'s',
              fr: 'Programmation informatique',
              en: 'Computer programming activities'
            },
            classification: 'MAIN',
            dateStart: '2020-01-15'
          }
        ]
      },
      {
        enterpriseNumber: '0987654321',
        vatNumber: 'BE0987654321',
        active: false,
        type: 'entity',
        typeDescription: {
          nl: 'Rechtspersoon',
          fr: 'Personne morale',
          en: 'Legal entity'
        },
        dateStart: '2015-03-20',
        dateEnd: '2023-12-31',
        juridicalForm: {
          code: '002',
          description: {
            nl: 'Naamloze vennootschap',
            fr: 'Société anonyme',
            en: 'Public limited company'
          }
        },
        juridicalSituation: {
          code: '002',
          description: {
            nl: 'Vereffening',
            fr: 'Liquidation',
            en: 'Liquidation'
          },
          dateStart: '2023-12-31'
        },
        denominations: [
          {
            entityNumber: '0987654321',
            entityType: 'enterprise',
            language: 'fr',
            value: 'Solutions Anciennes SA',
            type: 'social',
            typeDescription: {
              nl: 'Maatschappelijke benaming',
              fr: 'Dénomination sociale',
              en: 'Corporate name'
            },
            dateStart: '2015-03-20'
          }
        ],
        addresses: [
          {
            entityNumber: '0987654321',
            entityType: 'enterprise',
            street: {
              nl: 'Oude Laan 456',
              fr: 'Avenue Ancienne 456'
            },
            addressNumber: '456',
            zipcode: '2000',
            city: {
              nl: 'Antwerpen',
              fr: 'Anvers',
              en: 'Antwerp'
            },
            countryCode: 'BE',
            dateStart: '2015-03-20'
          }
        ],
        establishments: [],
        activities: [
          {
            naceVersion: 2008,
            naceCode: '70220',
            description: {
              nl: 'Advisering op het gebied van bedrijfsbeheer',
              fr: 'Conseil pour les affaires et autres conseils de gestion',
              en: 'Business and other management consultancy activities'
            },
            classification: 'MAIN',
            dateStart: '2015-03-20'
          }
        ]
      }
    ];

    const mockEstablishments: EstablishmentComplete[] = [
      {
        enterpriseNumber: '0123456789',
        establishmentNumber: '2123456789',
        active: true,
        dateStart: '2020-01-15',
        denominations: [
          {
            entityNumber: '2123456789',
            entityType: 'establishment',
            language: 'nl',
            value: 'Mock Tech Solutions - Hoofdzetel',
            type: 'commercial',
            typeDescription: {
              nl: 'Handelsnaam',
              fr: 'Nom commercial',
              en: 'Trade name'
            },
            dateStart: '2020-01-15'
          }
        ],
        addresses: [
          {
            entityNumber: '2123456789',
            entityType: 'establishment',
            street: {
              nl: 'Teststraat 123',
              fr: 'Rue de Test 123'
            },
            addressNumber: '123',
            zipcode: '1000',
            city: {
              nl: 'Brussel',
              fr: 'Bruxelles',
              en: 'Brussels'
            },
            countryCode: 'BE',
            dateStart: '2020-01-15'
          }
        ],
        activities: [
          {
            naceVersion: 2008,
            naceCode: '62010',
            description: {
              nl: 'Ontwikkeling van computerprogramma\'s',
              fr: 'Programmation informatique',
              en: 'Computer programming activities'
            },
            classification: 'MAIN',
            dateStart: '2020-01-15'
          }
        ]
      }
    ];

    return {
      enterprises: mockEnterprises,
      establishments: mockEstablishments
    };
  }

  async searchByNumber(number: string): Promise<KBOCompany | null> {
    if (!number?.trim()) {
      throw new KBOValidationError('Enterprise number is required');
    }

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 100));

    const enterprise = this.mockData.enterprises.find(e => e.enterpriseNumber === number);
    if (!enterprise) {
      return null;
    }

    const primaryAddress = enterprise.addresses[0];
    const primaryDenomination = enterprise.denominations.find(d => d.type === 'social')
      || enterprise.denominations[0];

    return {
      number: enterprise.enterpriseNumber,
      name: primaryDenomination?.value || '',
      address: {
        street: primaryAddress?.street.nl || primaryAddress?.street.fr || '',
        city: primaryAddress?.city.nl || primaryAddress?.city.fr || '',
        postalCode: primaryAddress?.zipcode || '',
        country: primaryAddress?.countryCode || 'BE',
      },
      status: enterprise.active ? 'active' : 'inactive',
      legalForm: enterprise.juridicalForm?.description.nl || enterprise.juridicalForm?.description.fr || '',
      establishmentDate: enterprise.dateStart,
    };
  }

  async searchByName(name: string): Promise<KBOCompany[]> {
    if (!name?.trim()) {
      throw new KBOValidationError('Company name is required');
    }

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 150));

    const matchingEnterprises = this.mockData.enterprises.filter(enterprise =>
      enterprise.denominations.some(denomination =>
        denomination.value.toLowerCase().includes(name.toLowerCase())
      )
    );

    return Promise.all(
      matchingEnterprises.map(async (enterprise) => {
        const company = await this.searchByNumber(enterprise.enterpriseNumber);
        return company!;
      })
    );
  }

  async getEnterprise(enterpriseNumber: string): Promise<EnterpriseComplete | null> {
    if (!enterpriseNumber?.trim()) {
      throw new KBOValidationError('Enterprise number is required');
    }

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 200));

    const enterprise = this.mockData.enterprises.find(e => e.enterpriseNumber === enterpriseNumber);
    return enterprise || null;
  }

  async getEstablishment(establishmentNumber: string): Promise<EstablishmentComplete | null> {
    if (!establishmentNumber?.trim()) {
      throw new KBOValidationError('Establishment number is required');
    }

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 200));

    const establishment = this.mockData.establishments.find(e => e.establishmentNumber === establishmentNumber);
    return establishment || null;
  }

  async searchEnterprises(params: EnterpriseSearchParams): Promise<KBOApiResponse<Enterprise[]>> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300));

    let filteredEnterprises = [...this.mockData.enterprises];

    // Apply filters
    if (params.enterpriseNumber) {
      filteredEnterprises = filteredEnterprises.filter(e =>
        e.enterpriseNumber.includes(params.enterpriseNumber!)
      );
    }

    if (params.vatNumber) {
      filteredEnterprises = filteredEnterprises.filter(e =>
        e.vatNumber?.includes(params.vatNumber!)
      );
    }

    if (params.denomination) {
      filteredEnterprises = filteredEnterprises.filter(e =>
        e.denominations.some(d =>
          d.value.toLowerCase().includes(params.denomination!.toLowerCase())
        )
      );
    }

    if (params.active !== undefined) {
      filteredEnterprises = filteredEnterprises.filter(e => e.active === params.active);
    }

    if (params.zipcode) {
      filteredEnterprises = filteredEnterprises.filter(e =>
        e.addresses.some(a => a.zipcode === params.zipcode)
      );
    }

    // Pagination
    const page = params.page || 1;
    const limit = params.limit || 20;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedResults = filteredEnterprises.slice(startIndex, endIndex);

    return {
      data: paginatedResults,
      meta: {
        totalItems: filteredEnterprises.length,
        itemsPerPage: limit,
        currentPage: page,
        totalPages: Math.ceil(filteredEnterprises.length / limit),
      },
    };
  }

  async searchEstablishments(params: EstablishmentSearchParams): Promise<KBOApiResponse<Establishment[]>> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300));

    let filteredEstablishments = [...this.mockData.establishments];

    // Apply filters
    if (params.enterpriseNumber) {
      filteredEstablishments = filteredEstablishments.filter(e =>
        e.enterpriseNumber.includes(params.enterpriseNumber!)
      );
    }

    if (params.establishmentNumber) {
      filteredEstablishments = filteredEstablishments.filter(e =>
        e.establishmentNumber.includes(params.establishmentNumber!)
      );
    }

    if (params.denomination) {
      filteredEstablishments = filteredEstablishments.filter(e =>
        e.denominations.some(d =>
          d.value.toLowerCase().includes(params.denomination!.toLowerCase())
        )
      );
    }

    if (params.active !== undefined) {
      filteredEstablishments = filteredEstablishments.filter(e => e.active === params.active);
    }

    if (params.zipcode) {
      filteredEstablishments = filteredEstablishments.filter(e =>
        e.addresses.some(a => a.zipcode === params.zipcode)
      );
    }

    // Pagination
    const page = params.page || 1;
    const limit = params.limit || 20;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedResults = filteredEstablishments.slice(startIndex, endIndex);

    return {
      data: paginatedResults,
      meta: {
        totalItems: filteredEstablishments.length,
        itemsPerPage: limit,
        currentPage: page,
        totalPages: Math.ceil(filteredEstablishments.length / limit),
      },
    };
  }
}