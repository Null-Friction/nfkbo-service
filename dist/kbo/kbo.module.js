"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.KboModule = void 0;
const common_1 = require("@nestjs/common");
const kbo_controller_1 = require("./kbo.controller");
const kbo_service_1 = require("./kbo.service");
const config_module_1 = require("../config/config.module");
const config_service_1 = require("../config/config.service");
const tokens_1 = require("./tokens");
const kbo_provider_factory_1 = require("./providers/kbo-provider.factory");
let KboModule = class KboModule {
};
exports.KboModule = KboModule;
exports.KboModule = KboModule = __decorate([
    (0, common_1.Module)({
        imports: [config_module_1.AppConfigModule],
        controllers: [kbo_controller_1.KboController],
        providers: [
            kbo_service_1.KboService,
            {
                provide: tokens_1.KBO_PROVIDER_TOKEN,
                useFactory: async (configService) => {
                    return await (0, kbo_provider_factory_1.createKBOProvider)(configService);
                },
                inject: [config_service_1.AppConfigService],
            },
        ],
        exports: [kbo_service_1.KboService, tokens_1.KBO_PROVIDER_TOKEN],
    })
], KboModule);
//# sourceMappingURL=kbo.module.js.map