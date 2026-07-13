import { Module, Global } from '@nestjs/common';
import { SchedulerController } from './presentation/scheduler.controller';
import { JobQueue } from './application/services/job-queue.service';
import { SchedulerEngine } from './infrastructure/engine/scheduler-engine';
import { DatabaseModule } from '../../infrastructure/database/database.module';
import { SecurityModule } from '../../infrastructure/security/security.module';
import { AuthModule } from '../../application/auth/auth.module';

@Global()
@Module({
  imports: [DatabaseModule, SecurityModule, AuthModule],
  controllers: [SchedulerController],
  providers: [
    JobQueue,
    SchedulerEngine,
    {
      provide: 'JOB_WORKERS',
      useFactory: () => {
        return [];
      },
    },
  ],
  exports: [JobQueue],
})
export class SchedulerModule {}
