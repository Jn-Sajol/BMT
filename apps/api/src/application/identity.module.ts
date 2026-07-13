import { Module } from '@nestjs/common';
import { UserService } from './services/user.service';
import { UserSessionService } from './services/user-session.service';
import { UserInvitationService } from './services/user-invitation.service';
import { DatabaseModule } from '../infrastructure/database/database.module';
import { SecurityModule } from '../infrastructure/security/security.module';

@Module({
  imports: [DatabaseModule, SecurityModule],
  providers: [
    UserService,
    UserSessionService,
    UserInvitationService,
  ],
  exports: [
    UserService,
    UserSessionService,
    UserInvitationService,
  ],
})
export class IdentityModule {}
