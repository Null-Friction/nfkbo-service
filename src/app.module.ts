import { Module } from '@nestjs/common';
import { KboModule } from './kbo/kbo.module';

@Module({
  imports: [KboModule],
})
export class AppModule {}