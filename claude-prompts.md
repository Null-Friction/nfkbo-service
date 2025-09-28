# Claude Code Prompts for NestJS Issues

Execute these prompts one by one in Claude Code terminal in the correct dependency order.

## 1. Issue #12: Configuration Management with ConfigModule

```
Implement proper configuration management with ConfigModule for the NestJS application. Install @nestjs/config, create configuration schemas with validation, replace direct environment variable access in KboService with ConfigService injection, and set up environment-based configuration. Update src/kbo/kbo.service.ts to use ConfigService instead of process.env.
```

## 2. Issue #13: Dependency Injection Enhancement

```
Enhance dependency injection for KBO providers. Create factory providers for KBOProvider selection using NestJS DI container, implement provider tokens, update KboModule to use factory provider, and refactor KboService to inject provider instead of manual instantiation. Use ConfigService for provider selection logic.
```

## 3. Issue #18: Module Organization and Structure

```
Reorganize the NestJS application module structure following best practices. Create ConfigModule, SharedModule, and HealthModule. Restructure src/ directory with proper separation: config/, shared/, health/, kbo/, and common/ directories. Update imports/exports between modules and create barrel exports.
```

## 4. Issue #14: Validation & DTOs with ValidationPipe

```
Add input validation using DTOs and ValidationPipe. Install class-validator and class-transformer packages. Create DTOs for all KBO controller endpoints (SearchByNumberDto, SearchByNameDto, EnterpriseSearchDto, EstablishmentSearchDto). Add validation decorators and configure global ValidationPipe in main.ts. Update controller methods to use DTOs.
```

## 5. Issue #15: Global Exception Handling

```
Implement global exception handling with custom filters. Create custom exception classes (KboProviderException, KboNotFoundError, KboValidationError, KboApiError), implement AllExceptionsFilter and KBO-specific exception filter, add proper error logging with context, and configure exception filters in main.ts. Ensure consistent error response format.
```

## 6. Issue #16: Logging & Response Interceptors

```
Add logging and response transformation interceptors. Create LoggingInterceptor for request/response tracking, ResponseTransformInterceptor for consistent API responses, PerformanceInterceptor for response time monitoring, and CorrelationIdInterceptor for request tracking. Configure all interceptors globally in main.ts.
```

## 7. Issue #17: Health Checks with @nestjs/terminus

```
Implement health checks using @nestjs/terminus. Install @nestjs/terminus package, create HealthModule with health controller, implement KboProviderHealthIndicator to check KBO API availability, add /health, /health/live, and /health/ready endpoints. Configure proper timeout and retry logic for health checks.
```

## 8. Issue #6: Authentication and API Key Management

```
Implement authentication and API key management for NestJS. Create authentication guard for controllers, implement API key validation and storage service, add rate limiting interceptor per API key, create configuration for different access levels, add request logging and monitoring, implement exception filters for auth failures, and create environment-based auth configuration using ConfigModule.
```

## 9. Issue #19: OpenAPI/Swagger Documentation

```
Add comprehensive OpenAPI/Swagger documentation using @nestjs/swagger. Install @nestjs/swagger package, configure SwaggerModule in main.ts, add OpenAPI decorators to controllers (@ApiTags, @ApiOperation, @ApiParam, @ApiQuery, @ApiResponse) and DTOs (@ApiProperty), create endpoint descriptions with examples, and set up Swagger UI at /api/docs.
```

## Usage Instructions

1. Copy each prompt individually
2. Execute in Claude Code terminal: `claude "prompt text here"`
3. Wait for completion before proceeding to next issue
4. Follow the dependency order (1→2→3→4→5→6→7→8→9)
5. Test the application after each implementation
6. Run `npm run lint` and `npm run typecheck` after each issue

## Testing Commands After Each Issue

```bash
# Build and test
npm run build
npm run test
npm run lint
npm run typecheck

# Start development server
npm run start:dev

# Test health endpoint (after issue #17)
curl http://localhost:3000/health

# Test API documentation (after issue #19)
open http://localhost:3000/api/docs
```