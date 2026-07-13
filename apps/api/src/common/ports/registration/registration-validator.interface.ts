import { RegistrationRequestDto } from '../../dto/registration.dto';

export interface IRegistrationValidator {
  validate(dto: RegistrationRequestDto): Promise<void>;
}
