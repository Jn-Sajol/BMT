import { Module } from '@nestjs/common';
import { ProjectionService } from './application/services/projection.service';
import { AnalyticsObserver } from './application/services/analytics-observer.service';
import { AnalyticsController } from './presentation/analytics.controller';
import { ActionModule } from '../action/action.module';
import { DatabaseModule } from '../../../infrastructure/database/database.module';
import { EventUpcasterRegistry } from './application/upcasters/event-upcaster.registry';
import { TriggerMatchedUpcaster_1_0_to_2_0 } from './application/upcasters/core-upcasters';

@Module({
  imports: [DatabaseModule, ActionModule],
  controllers: [AnalyticsController],
  providers: [
    ProjectionService,
    AnalyticsObserver,
    EventUpcasterRegistry,
    TriggerMatchedUpcaster_1_0_to_2_0,
    {
      provide: 'EVENT_UPCASTERS',
      useFactory: (u1: TriggerMatchedUpcaster_1_0_to_2_0) => [u1],
      inject: [TriggerMatchedUpcaster_1_0_to_2_0],
    },
  ],
  exports: [
    ProjectionService,
    AnalyticsObserver,
    EventUpcasterRegistry,
  ],
})
export class AnalyticsModule {}
