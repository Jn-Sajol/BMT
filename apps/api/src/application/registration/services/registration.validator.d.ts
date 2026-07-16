import { RegistrationRequestDto } from '../../../common/dto/registration.dto';
import { IRegistrationValidator } from '../../../common/ports/registration/registration-validator.interface';
export declare class RegistrationValidator implements IRegistrationValidator {
    validate(dto: RegistrationRequestDto): Promise<void>;
}
