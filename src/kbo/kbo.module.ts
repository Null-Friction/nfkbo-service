import { Module } from '@nestjs/common';
import { KboController } from './kbo.controller';
import { KboService } from './kbo.service';

@Module({
  controllers: [KboController],
  providers: [KboService],
  exports: [KboService],
})
export class KboModule {}