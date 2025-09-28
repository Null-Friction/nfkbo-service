import { AppConfigService } from '../../config/config.service';
import { KBOProvider } from '../../common/types/kbo';
export declare function createKBOProvider(configService: AppConfigService): Promise<KBOProvider>;
