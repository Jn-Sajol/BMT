export class LoginDto {
  email!: string;
  password!: string;
}

export class RegisterDto {
  email!: string;
  name?: string;
  password!: string;
}

export class TokenResponseDto {
  accessToken!: string;
  refreshToken!: string;
  expiresIn!: number;
}

export class ResetPasswordDto {
  token!: string;
  newPassword!: string;
}
