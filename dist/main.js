"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const helmet_1 = require("helmet");
const app_module_1 = require("./app.module");
const filters_1 = require("./common/filters");
const interceptors_1 = require("./common/interceptors");
const config_service_1 = require("./config/config.service");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const expressApp = app.getHttpAdapter().getInstance();
    expressApp.set('trust proxy', 1);
    app.use((0, helmet_1.default)());
    const allowedOrigins = process.env.CORS_ALLOWED_ORIGINS?.split(',') || [];
    app.enableCors({
        origin: allowedOrigins.length > 0 ? allowedOrigins : false,
        credentials: true,
    });
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
    app.use((req, res, next) => {
        const contentLength = parseInt(req.headers['content-length'] || '0', 10);
        const maxSize = 10 * 1024 * 1024;
        if (contentLength > maxSize) {
            res.status(413).json({ error: 'Payload too large' });
            return;
        }
        next();
    });
    app.useGlobalInterceptors(new interceptors_1.CorrelationIdInterceptor(), new interceptors_1.PerformanceInterceptor(), new interceptors_1.LoggingInterceptor(), new interceptors_1.ResponseTransformInterceptor());
    app.useGlobalFilters(new filters_1.KboExceptionFilter(), new filters_1.AllExceptionsFilter());
    const configService = app.get(config_service_1.AppConfigService);
    const port = configService.port;
    await app.listen(port);
    common_1.Logger.log(`Application is running on: http://localhost:${port}/api`, 'Bootstrap');
}
void bootstrap();
//# sourceMappingURL=main.js.map