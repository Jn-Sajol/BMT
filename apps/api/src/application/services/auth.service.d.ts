import { IAuthService } from '../../common/ports/auth/auth-service.interface';
import { LoginDto, RegisterDto, TokenResponseDto } from '../../common/dto/auth.dto';
import { CreateSessionDto } from '../../common/dto/session.dto';
import { UserRepository } from '../../infrastructure/database/repositories/user.repository';
import { UserSessionService } from './user-session.service';
import { IRegistrationService } from '../../common/ports/registration/registration-service.interface';
import { PermissionService } from './permission.service';
import { RoleRepository } from '../../infrastructure/database/repositories/role.repository';
import { IPasswordHasher } from '../../common/ports/password-hasher.interface';
import { ITokenGenerator } from '../../common/ports/token-generator.interface';
import { IClockProvider } from '../../common/ports/clock-provider.interface';
export declare class AuthService implements IAuthService {
    private readonly userRepo;
    private readonly sessionService;
    private readonly registrationService;
    private readonly permissionService;
    private readonly roleRepo;
    private readonly passwordHasher;
    private readonly tokenGenerator;
    private readonly clockProvider;
    constructor(userRepo: UserRepository, sessionService: UserSessionService, registrationService: IRegistrationService, permissionService: PermissionService, roleRepo: RoleRepository, passwordHasher: IPasswordHasher, tokenGenerator: ITokenGenerator, clockProvider: IClockProvider);
    register(dto: RegisterDto): Promise<void>;
    login(dto: LoginDto, sessionMeta?: Partial<CreateSessionDto>): Promise<TokenResponseDto>;
    refresh(refreshToken: string, sessionMeta?: Partial<CreateSessionDto>): Promise<TokenResponseDto>;
    logout(accessToken: string): Promise<void>;
    me(userId: string): Promise<any>;
}
