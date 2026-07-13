import { Injectable } from '@nestjs/common';
import { RegistrationRequestDto } from '../../../common/dto/registration.dto';
import { IRegistrationValidator } from '../../../common/ports/registration/registration-validator.interface';
import { InvalidEmailException, InvalidPasswordException } from '../../../common/exceptions/registration-exceptions';

@Injectable()
export class RegistrationValidator implements IRegistrationValidator {
  async validate(dto: RegistrationRequestDto): Promise<void> {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(dto.email)) {
      throw new InvalidEmailException('Email address is invalid');
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!passwordRegex.test(dto.password)) {
      throw new InvalidPasswordException(
        'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number'
      );
    }
  }
}
