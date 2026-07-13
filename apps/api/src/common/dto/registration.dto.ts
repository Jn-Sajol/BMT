export class RegistrationRequestDto {
  email!: string;
  password!: string;
  name?: string;
}

export class RegistrationResponseDto {
  userId!: string;
  email!: string;
  status!: string;
}
