"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const kbo_module_1 = require("./kbo/kbo.module");
const config_module_1 = require("./config/config.module");
const shared_module_1 = require("./shared/shared.module");
const health_module_1 = require("./health/health.module");
const auth_module_1 = require("./auth/auth.module");
const configuration_1 = require("./config/configuration");
const api_key_db_entity_1 = require("./auth/entities/api-key-db.entity");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                validate: configuration_1.validateConfig,
                cache: true,
                envFilePath: [
                    '.env.local',
                    `.env.${process.env.NODE_ENV || 'development'}`,
                    '.env',
                ],
            }),
            typeorm_1.TypeOrmModule.forRootAsync({
                imports: [config_1.ConfigModule],
                useFactory: (configService) => ({
                    type: 'postgres',
                    host: configService.get('database.host'),
                    port: configService.get('database.port'),
                    username: configService.get('database.username'),
                    password: configService.get('database.password'),
                    database: configService.get('database.database'),
                    entities: [api_key_db_entity_1.ApiKeyEntity],
                    synchronize: configService.get('database.synchronize'),
                    logging: configService.get('database.logging'),
                }),
                inject: [config_1.ConfigService],
            }),
            config_module_1.AppConfigModule,
            shared_module_1.SharedModule,
            auth_module_1.AuthModule,
            health_module_1.HealthModule,
            kbo_module_1.KboModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map