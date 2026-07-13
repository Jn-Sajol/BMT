import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { CorrelationService } from './services/correlation.service';
import { StructuredLogger } from './services/logger.service';
import { TelemetryService } from './services/telemetry.service';
import { HealthService } from './services/health.service';
import { TelemetryInterceptor } from './interceptors/telemetry.interceptor';
import { LoggingInterceptor } from './interceptors/logging.interceptor';
import { CorrelationIdMiddleware } from './middleware/correlation-id.middleware';
import { ObservabilityController } from './presentation/observability.controller';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [ObservabilityController],
  providers: [
    CorrelationService,
    StructuredLogger,
    TelemetryService,
    HealthService,
    TelemetryInterceptor,
    LoggingInterceptor,
  ],
  exports: [
    CorrelationService,
    StructuredLogger,
    TelemetryService,
    HealthService,
    TelemetryInterceptor,
    LoggingInterceptor,
  ],
})
export class ObservabilityModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CorrelationIdMiddleware).forRoutes('*');
  }
}
