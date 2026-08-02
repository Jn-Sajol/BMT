import { Module } from '@nestjs/common';
import { WorkspaceService } from './services/workspace.service';
import { DatabaseModule } from '../infrastructure/database/database.module';
import { WorkspaceController } from '../presentation/workspace/workspace.controller';

@Module({
  imports: [DatabaseModule],
  controllers: [WorkspaceController],
  providers: [WorkspaceService],
  exports: [WorkspaceService],
})
export class WorkspaceModule {}
