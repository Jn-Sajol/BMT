import { Module } from '@nestjs/common';
import { SchedulerEngine } from './application/services/scheduler-engine.service';
import { SchedulerLoop } from './application/services/scheduler-loop.service';
import { DistributedLockService } from './application/services/distributed-lock.service';
import { TimezoneConversionService } from './application/services/timezone-conversion.service';
import { SchedulerController } from './presentation/scheduler.controller';
import { ActionModule } from '../action/action.module';
import { DatabaseModule } from '../../../infrastructure/database/database.module';

@Module({
  imports: [DatabaseModule, ActionModule],
  controllers: [SchedulerController],
  providers: [
    SchedulerEngine,
    SchedulerLoop,
    {
      provide: 'ISchedulerEngine',
      useClass: SchedulerEngine,
    },
    {
      provide: 'ISchedulerLock',
      useClass: DistributedLockService,
    },
    {
      provide: 'ITimezoneConverter',
      useClass: TimezoneConversionService,
    },
  ],
  exports: [
    SchedulerEngine,
    SchedulerLoop,
    'ISchedulerEngine',
    'ISchedulerLock',
    'ITimezoneConverter',
  ],
})
export class SchedulerModule {}
