"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const core_1 = require("@nestjs/core");
const auth_controller_1 = require("./auth.controller");
const api_key_service_1 = require("./services/api-key.service");
const api_key_guard_1 = require("./guards/api-key.guard");
const auth_exception_filter_1 = require("./filters/auth-exception.filter");
const rate_limit_interceptor_1 = require("./interceptors/rate-limit.interceptor");
const api_key_db_entity_1 = require("./entities/api-key-db.entity");
let AuthModule = class AuthModule {
};
exports.AuthModule = AuthModule;
exports.AuthModule = AuthModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([api_key_db_entity_1.ApiKeyEntity])],
        controllers: [auth_controller_1.AuthController],
        providers: [
            api_key_service_1.ApiKeyService,
            {
                provide: core_1.APP_GUARD,
                useClass: api_key_guard_1.ApiKeyGuard,
            },
            {
                provide: core_1.APP_FILTER,
                useClass: auth_exception_filter_1.AuthExceptionFilter,
            },
            {
                provide: core_1.APP_INTERCEPTOR,
                useClass: rate_limit_interceptor_1.RateLimitInterceptor,
            },
        ],
        exports: [api_key_service_1.ApiKeyService],
    })
], AuthModule);
//# sourceMappingURL=auth.module.js.map