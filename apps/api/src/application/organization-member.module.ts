import { Module } from '@nestjs/common';
import { OrganizationMemberService } from './services/organization-member.service';
import { DatabaseModule } from '../infrastructure/database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [OrganizationMemberService],
  exports: [OrganizationMemberService],
})
export class OrganizationMemberModule {}
