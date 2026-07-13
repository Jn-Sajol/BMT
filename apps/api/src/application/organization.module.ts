import { Module } from '@nestjs/common';
import { OrganizationService } from './services/organization.service';
import { DatabaseModule } from '../infrastructure/database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [OrganizationService],
  exports: [OrganizationService],
})
export class OrganizationModule {}
