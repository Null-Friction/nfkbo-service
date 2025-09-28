import { Controller, Get, Param, Query } from '@nestjs/common';
import { KboService } from './kbo.service';
import {
  KBOCompany,
  EnterpriseComplete,
  EstablishmentComplete,
  KBOApiResponse,
  Enterprise,
  Establishment,
} from '../common/types';
import {
  SearchByNumberDto,
  SearchByNameDto,
  GetEnterpriseDto,
  SearchByEstablishmentNumberDto,
  EnterpriseSearchDto,
  EstablishmentSearchDto,
} from './dto';

@Controller('kbo')
export class KboController {
  constructor(private readonly kboService: KboService) {}

  @Get('companies/search/number/:number')
  async searchByNumber(@Param() params: SearchByNumberDto): Promise<KBOCompany | null> {
    return this.kboService.searchByNumber(params.number);
  }

  @Get('companies/search/name')
  async searchByName(@Query() query: SearchByNameDto): Promise<KBOCompany[]> {
    return this.kboService.searchByName(query.name);
  }

  @Get('enterprises/:enterpriseNumber')
  async getEnterprise(@Param() params: GetEnterpriseDto): Promise<EnterpriseComplete | null> {
    return this.kboService.getEnterprise(params.enterpriseNumber);
  }

  @Get('establishments/:establishmentNumber')
  async getEstablishment(@Param() params: SearchByEstablishmentNumberDto): Promise<EstablishmentComplete | null> {
    return this.kboService.getEstablishment(params.establishmentNumber);
  }

  @Get('enterprises')
  async searchEnterprises(@Query() params: EnterpriseSearchDto): Promise<KBOApiResponse<Enterprise[]>> {
    return this.kboService.searchEnterprises(params);
  }

  @Get('establishments')
  async searchEstablishments(@Query() params: EstablishmentSearchDto): Promise<KBOApiResponse<Establishment[]>> {
    return this.kboService.searchEstablishments(params);
  }
}