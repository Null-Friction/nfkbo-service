"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const app_module_1 = require("./app.module");
const config_service_1 = require("./config/config.service");
const filters_1 = require("./common/filters");
const interceptors_1 = require("./common/interceptors");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors();
    app.setGlobalPrefix('api');
    app.useGlobalPipes(new common_1.ValidationPipe({
        transform: true,
        transformOptions: {
            enableImplicitConversion: true,
        },
        whitelist: true,
        forbidNonWhitelisted: true,
        skipMissingProperties: false,
        validationError: {
            target: false,
            value: false,
        },
    }));
    app.useGlobalInterceptors(new interceptors_1.CorrelationIdInterceptor(), new interceptors_1.PerformanceInterceptor(), new interceptors_1.LoggingInterceptor(), new interceptors_1.ResponseTransformInterceptor());
    app.useGlobalFilters(new filters_1.KboExceptionFilter(), new filters_1.AllExceptionsFilter());
    const configService = app.get(config_service_1.AppConfigService);
    const port = configService.port;
    await app.listen(port);
    console.log(`Application is running on: http://localhost:${port}/api`);
}
bootstrap();
//# sourceMappingURL=main.js.map