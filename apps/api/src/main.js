"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const helmet_1 = __importDefault(require("helmet"));
const app_module_1 = require("./app.module");
const env_config_1 = require("./common/config/env.config");
const response_interceptor_1 = require("./common/interceptors/response.interceptor");
const all_exceptions_filter_1 = require("./common/filters/all-exceptions.filter");
async function bootstrap() {
    // Validate env settings before starting the runtime
    const config = (0, env_config_1.loadEnvConfig)();
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    // Security configuration
    app.use((0, helmet_1.default)());
    app.enableCors({
        origin: '*', // Enforce strict cors in production settings
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
        allowedHeaders: 'Content-Type, Accept, Authorization, x-request-id',
    });
    // Global Prefix and Versioning Configuration
    app.setGlobalPrefix('api');
    app.enableVersioning({
        type: common_1.VersioningType.URI,
        defaultVersion: '1',
    });
    // Global Pipelines & Adapters
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
    }));
    app.useGlobalInterceptors(new response_interceptor_1.ResponseInterceptor());
    app.useGlobalFilters(new all_exceptions_filter_1.AllExceptionsFilter());
    // Enable Graceful Shutdown hooks
    app.enableShutdownHooks();
    // Swagger Documentation Setup
    const swaggerConfig = new swagger_1.DocumentBuilder()
        .setTitle('JNS Marketing OS API')
        .setDescription('Enterprise-grade REST API backend for campaign and channel automation')
        .setVersion('1.0.0')
        .addBearerAuth()
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, swaggerConfig);
    swagger_1.SwaggerModule.setup('api/docs', app, document);
    const port = config.API_PORT;
    await app.listen(port);
    console.log(`🚀 Server launched successfully on port: ${port}`);
    console.log(`📋 API Health Check: http://localhost:${port}/api/v1/health`);
    console.log(`📖 API Documentation: http://localhost:${port}/api/docs`);
}
bootstrap();
//# sourceMappingURL=main.js.map