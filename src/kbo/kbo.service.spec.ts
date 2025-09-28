import { Test, TestingModule } from '@nestjs/testing';
import { KboService } from './kbo.service';
import { KBO_PROVIDER_TOKEN } from './tokens';
import { KBOProvider } from '../types/kbo';

describe('KboService', () => {
  let service: KboService;
  let mockProvider: jest.Mocked<KBOProvider>;

  beforeEach(async () => {
    // Create a mock provider
    mockProvider = {
      searchByNumber: jest.fn(),
      searchByName: jest.fn(),
      getEnterprise: jest.fn(),
      getEstablishment: jest.fn(),
      searchEnterprises: jest.fn(),
      searchEstablishments: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        KboService,
        {
          provide: KBO_PROVIDER_TOKEN,
          useValue: mockProvider,
        },
      ],
    }).compile();

    service = module.get<KboService>(KboService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('searchByNumber', () => {
    it('should call provider searchByNumber method', async () => {
      const testNumber = '0776834537';
      const expectedResult = {
        number: testNumber,
        name: 'Test Company',
        address: {
          street: 'Test Street 1',
          city: 'Brussels',
          postalCode: '1000',
          country: 'Belgium'
        },
        status: 'active' as const,
        legalForm: 'NV',
        establishmentDate: '2020-01-01'
      };

      mockProvider.searchByNumber.mockResolvedValue(expectedResult);

      const result = await service.searchByNumber(testNumber);

      expect(mockProvider.searchByNumber).toHaveBeenCalledWith(testNumber);
      expect(result).toBe(expectedResult);
    });

    it('should return null when provider returns null', async () => {
      const testNumber = '0776834537';

      mockProvider.searchByNumber.mockResolvedValue(null);

      const result = await service.searchByNumber(testNumber);

      expect(mockProvider.searchByNumber).toHaveBeenCalledWith(testNumber);
      expect(result).toBeNull();
    });
  });

  describe('searchByName', () => {
    it('should call provider searchByName method', async () => {
      const testName = 'Test Company';
      const expectedResult = [{
        number: '0776834537',
        name: testName,
        address: {
          street: 'Test Street 1',
          city: 'Brussels',
          postalCode: '1000',
          country: 'Belgium'
        },
        status: 'active' as const,
        legalForm: 'NV'
      }];

      mockProvider.searchByName.mockResolvedValue(expectedResult);

      const result = await service.searchByName(testName);

      expect(mockProvider.searchByName).toHaveBeenCalledWith(testName);
      expect(result).toBe(expectedResult);
    });
  });

  describe('getEnterprise', () => {
    it('should call provider getEnterprise method', async () => {
      const enterpriseNumber = '0776834537';
      const expectedResult = {
        enterpriseNumber,
        vatNumber: 'BE0776834537',
        active: true,
        type: 'entity' as const,
        typeDescription: { nl: 'Rechtspersoon', en: 'Legal Entity' },
        dateStart: '2020-01-01',
        denominations: [],
        addresses: [],
        establishments: [],
        activities: []
      };

      mockProvider.getEnterprise.mockResolvedValue(expectedResult);

      const result = await service.getEnterprise(enterpriseNumber);

      expect(mockProvider.getEnterprise).toHaveBeenCalledWith(enterpriseNumber);
      expect(result).toBe(expectedResult);
    });
  });

  describe('getEstablishment', () => {
    it('should call provider getEstablishment method', async () => {
      const establishmentNumber = '2345678901';
      const expectedResult = {
        enterpriseNumber: '0776834537',
        establishmentNumber,
        active: true,
        dateStart: '2020-01-01',
        denominations: [],
        addresses: [],
        activities: []
      };

      mockProvider.getEstablishment.mockResolvedValue(expectedResult);

      const result = await service.getEstablishment(establishmentNumber);

      expect(mockProvider.getEstablishment).toHaveBeenCalledWith(establishmentNumber);
      expect(result).toBe(expectedResult);
    });
  });

  describe('searchEnterprises', () => {
    it('should call provider searchEnterprises method', async () => {
      const searchParams = { denomination: 'test', page: 1, limit: 10 };
      const expectedResult = {
        data: [],
        meta: {
          totalItems: 0,
          itemsPerPage: 10,
          currentPage: 1,
          totalPages: 0
        }
      };

      mockProvider.searchEnterprises.mockResolvedValue(expectedResult);

      const result = await service.searchEnterprises(searchParams);

      expect(mockProvider.searchEnterprises).toHaveBeenCalledWith(searchParams);
      expect(result).toBe(expectedResult);
    });
  });

  describe('searchEstablishments', () => {
    it('should call provider searchEstablishments method', async () => {
      const searchParams = { denomination: 'test', page: 1, limit: 10 };
      const expectedResult = {
        data: [],
        meta: {
          totalItems: 0,
          itemsPerPage: 10,
          currentPage: 1,
          totalPages: 0
        }
      };

      mockProvider.searchEstablishments.mockResolvedValue(expectedResult);

      const result = await service.searchEstablishments(searchParams);

      expect(mockProvider.searchEstablishments).toHaveBeenCalledWith(searchParams);
      expect(result).toBe(expectedResult);
    });
  });
});