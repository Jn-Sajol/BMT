import { Module } from '@nestjs/common';
import { VerificationService } from './services/verification.service';
import { DatabaseModule } from '../infrastructure/database/database.module';
import { SecurityModule } from '../infrastructure/security/security.module';

@Module({
  imports: [DatabaseModule, SecurityModule],
  providers: [VerificationService],
  exports: [VerificationService],
})
export class VerificationModule {}
