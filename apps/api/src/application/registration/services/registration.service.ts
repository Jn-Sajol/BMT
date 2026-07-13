import { Injectable } from '@nestjs/common';
import { RegistrationRequestDto, RegistrationResponseDto } from '../../../common/dto/registration.dto';
import { IRegistrationService } from '../../../common/ports/registration/registration-service.interface';
import { UserService } from '../../services/user.service';
import { RegistrationValidator } from './registration.validator';
import { RegistrationMapper } from '../../../common/mappers/registration.mapper';

@Injectable()
export class RegistrationService implements IRegistrationService {
  constructor(
    private readonly userService: UserService,
    private readonly validator: RegistrationValidator,
  ) {}

  async register(dto: RegistrationRequestDto): Promise<RegistrationResponseDto> {
    // Validate inputs formats
    await this.validator.validate(dto);

    // Call user creation workflow
    const user = await this.userService.createUser({
      email: dto.email,
      name: dto.name,
      password: dto.password,
    });

    return RegistrationMapper.toResponse(user);
  }
}
