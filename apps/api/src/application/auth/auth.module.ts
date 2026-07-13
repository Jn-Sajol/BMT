import { Module } from '@nestjs/common';
import { AuthController } from '../../presentation/auth/auth.controller';
import { AuthService } from '../services/auth.service';
import { AUTH_SERVICE_TOKEN } from './auth.constants';
import { DatabaseModule } from '../../infrastructure/database/database.module';
import { SecurityModule } from '../../infrastructure/security/security.module';
import { IdentityModule } from '../identity.module';
import { RegistrationModule } from '../registration/registration.module';
import { VerificationModule } from '../verification.module';
import { PasswordResetModule } from '../password-reset.module';
import { RbacModule } from '../rbac.module';
import { AuthGuard } from '../../common/guards/auth.guard';

@Module({
  imports: [
    DatabaseModule,
    SecurityModule,
    IdentityModule,
    RegistrationModule,
    VerificationModule,
    PasswordResetModule,
    RbacModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthGuard,
    {
      provide: AUTH_SERVICE_TOKEN,
      useClass: AuthService,
    },
  ],
  exports: [AUTH_SERVICE_TOKEN, AuthGuard],
})
export class AuthModule {}
