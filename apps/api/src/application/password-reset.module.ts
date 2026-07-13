import { Module, Injectable } from '@nestjs/common';
import { PasswordResetService, PASSWORD_HISTORY_VALIDATOR } from './services/password-reset.service';
import { DatabaseModule } from '../infrastructure/database/database.module';
import { SecurityModule } from '../infrastructure/security/security.module';
import { IdentityModule } from './identity.module';
import { IPasswordHistoryValidator } from '../common/ports/identity/password-history-validator.interface';

@Injectable()
export class MockPasswordHistoryValidator implements IPasswordHistoryValidator {
  async validate(userId: string, newPasswordPlain: string): Promise<void> {
    // Mock validator always succeeds for interface-only validation requirement
    return;
  }
}

@Module({
  imports: [DatabaseModule, SecurityModule, IdentityModule],
  providers: [
    PasswordResetService,
    {
      provide: PASSWORD_HISTORY_VALIDATOR,
      useClass: MockPasswordHistoryValidator,
    },
  ],
  exports: [PasswordResetService],
})
export class PasswordResetModule {}
