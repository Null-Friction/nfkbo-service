import { Controller, Get, Param, Query } from '@nestjs/common';
import { KboService } from './kbo.service';
import {
  KBOCompany,
  EnterpriseComplete,
  EstablishmentComplete,
  KBOApiResponse,
  Enterprise,
  Establishment,
  EnterpriseSearchParams,
  EstablishmentSearchParams,
} from '../types';

@Controller('kbo')
export class KboController {
  constructor(private readonly kboService: KboService) {}

  @Get('companies/search/number/:number')
  async searchByNumber(@Param('number') number: string): Promise<KBOCompany | null> {
    return this.kboService.searchByNumber(number);
  }

  @Get('companies/search/name')
  async searchByName(@Query('name') name: string): Promise<KBOCompany[]> {
    return this.kboService.searchByName(name);
  }

  @Get('enterprises/:enterpriseNumber')
  async getEnterprise(@Param('enterpriseNumber') enterpriseNumber: string): Promise<EnterpriseComplete | null> {
    return this.kboService.getEnterprise(enterpriseNumber);
  }

  @Get('establishments/:establishmentNumber')
  async getEstablishment(@Param('establishmentNumber') establishmentNumber: string): Promise<EstablishmentComplete | null> {
    return this.kboService.getEstablishment(establishmentNumber);
  }

  @Get('enterprises')
  async searchEnterprises(@Query() params: EnterpriseSearchParams): Promise<KBOApiResponse<Enterprise[]>> {
    return this.kboService.searchEnterprises(params);
  }

  @Get('establishments')
  async searchEstablishments(@Query() params: EstablishmentSearchParams): Promise<KBOApiResponse<Establishment[]>> {
    return this.kboService.searchEstablishments(params);
  }
}