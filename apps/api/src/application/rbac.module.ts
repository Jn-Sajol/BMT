import { Module } from '@nestjs/common';
import { PermissionService } from './services/permission.service';
import { AuthorizationService } from './services/authorization.service';
import { DatabaseModule } from '../infrastructure/database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [PermissionService, AuthorizationService],
  exports: [PermissionService, AuthorizationService],
})
export class RbacModule {}
