import { Module, Global } from '@nestjs/common';
import { Argon2PasswordHasher } from './argon2-password-hasher';
import { SecureTokenGenerator } from './secure-token-generator';
import { UuidProvider } from './uuid-provider';
import { ClockProvider } from './clock-provider';
import { Aes256Encryption } from './aes-256-encryption';
import { RandomStringGenerator } from './random-string-generator';

export const PASSWORD_HASHER = 'PASSWORD_HASHER';
export const TOKEN_GENERATOR = 'TOKEN_GENERATOR';
export const UUID_PROVIDER = 'UUID_PROVIDER';
export const CLOCK_PROVIDER = 'CLOCK_PROVIDER';
export const ENCRYPTION_SERVICE = 'ENCRYPTION_SERVICE';
export const RANDOM_STRING_GENERATOR = 'RANDOM_STRING_GENERATOR';

@Global()
@Module({
  providers: [
    { provide: PASSWORD_HASHER, useClass: Argon2PasswordHasher },
    { provide: TOKEN_GENERATOR, useClass: SecureTokenGenerator },
    { provide: UUID_PROVIDER, useClass: UuidProvider },
    { provide: CLOCK_PROVIDER, useClass: ClockProvider },
    { provide: ENCRYPTION_SERVICE, useClass: Aes256Encryption },
    { provide: RANDOM_STRING_GENERATOR, useClass: RandomStringGenerator },
  ],
  exports: [
    PASSWORD_HASHER,
    TOKEN_GENERATOR,
    UUID_PROVIDER,
    CLOCK_PROVIDER,
    ENCRYPTION_SERVICE,
    RANDOM_STRING_GENERATOR,
  ],
})
export class SecurityModule {}
