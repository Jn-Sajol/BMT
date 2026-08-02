import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class RegistrationRequestDto {
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password!: string;

  @IsString()
  @IsOptional()
  name?: string;
}

export class RegistrationResponseDto {
  @IsString()
  userId!: string;

  @IsEmail()
  email!: string;

  @IsString()
  status!: string;
}
