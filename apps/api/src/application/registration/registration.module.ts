import { Module } from '@nestjs/common';
import { RegistrationService } from './services/registration.service';
import { RegistrationValidator } from './services/registration.validator';
import { IdentityModule } from '../identity.module';
import { REGISTRATION_SERVICE_TOKEN, REGISTRATION_VALIDATOR_TOKEN } from './registration.constants';

@Module({
  imports: [IdentityModule],
  providers: [
    RegistrationValidator,
    {
      provide: REGISTRATION_SERVICE_TOKEN,
      useClass: RegistrationService,
    },
    {
      provide: REGISTRATION_VALIDATOR_TOKEN,
      useClass: RegistrationValidator,
    },
  ],
  exports: [
    REGISTRATION_SERVICE_TOKEN,
    REGISTRATION_VALIDATOR_TOKEN,
  ],
})
export class RegistrationModule {}
