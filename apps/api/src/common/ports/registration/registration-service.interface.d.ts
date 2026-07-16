import { RegistrationRequestDto, RegistrationResponseDto } from '../../dto/registration.dto';
export interface IRegistrationService {
    register(dto: RegistrationRequestDto): Promise<RegistrationResponseDto>;
}
