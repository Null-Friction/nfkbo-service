import { Module } from '@nestjs/common';
import { AppConfigModule } from '../config/config.module';
import { AppConfigService } from '../config/config.service';
import { KboController } from './kbo.controller';
import { KboService } from './kbo.service';
import { createKBOProvider } from './providers/kbo-provider.factory';
import { KBO_PROVIDER_TOKEN } from './tokens';

@Module({
  imports: [AppConfigModule],
  controllers: [KboController],
  providers: [
    KboService,
    {
      provide: KBO_PROVIDER_TOKEN,
      useFactory: async (configService: AppConfigService) => {
        return await createKBOProvider(configService);
      },
      inject: [AppConfigService],
    },
  ],
  exports: [KboService, KBO_PROVIDER_TOKEN],
})
export class KboModule {}