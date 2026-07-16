import { RegistrationRequestDto, RegistrationResponseDto } from '../../../common/dto/registration.dto';
import { IRegistrationService } from '../../../common/ports/registration/registration-service.interface';
import { UserService } from '../../services/user.service';
import { RegistrationValidator } from './registration.validator';
export declare class RegistrationService implements IRegistrationService {
    private readonly userService;
    private readonly validator;
    constructor(userService: UserService, validator: RegistrationValidator);
    register(dto: RegistrationRequestDto): Promise<RegistrationResponseDto>;
}
