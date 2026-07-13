import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateVerificationTokenDto {
  @IsUUID('4')
  @IsNotEmpty()
  userId!: string;

  @IsString()
  @IsNotEmpty()
  tokenType!: string; // e.g. EMAIL_VERIFICATION
}

export class VerifyEmailDto {
  @IsString()
  @IsNotEmpty()
  token!: string;
}

export class VerificationResponseDto {
  userId!: string;
  email!: string;
  status!: string;
  verifiedAt!: string;
}
