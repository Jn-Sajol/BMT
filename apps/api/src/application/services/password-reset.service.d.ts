import { PasswordResetToken } from '@prisma/client';
import { RequestPasswordResetDto, PasswordResetResponseDto, ExecutePasswordResetDto } from '../../common/dto/password-reset.dto';
import { IPasswordResetService } from '../../common/ports/identity/password-reset-service.interface';
import { PasswordResetRepository } from '../../infrastructure/database/repositories/password-reset.repository';
import { UserRepository } from '../../infrastructure/database/repositories/user.repository';
import { ITokenGenerator } from '../../common/ports/token-generator.interface';
import { IClockProvider } from '../../common/ports/clock-provider.interface';
import { IPasswordHasher } from '../../common/ports/password-hasher.interface';
import { IPasswordHistoryValidator } from '../../common/ports/identity/password-history-validator.interface';
import { UserSessionService } from './user-session.service';
export declare const PASSWORD_HISTORY_VALIDATOR = "PASSWORD_HISTORY_VALIDATOR";
export declare class PasswordResetService implements IPasswordResetService {
    private readonly resetRepo;
    private readonly userRepo;
    private readonly userSessionService;
    private readonly tokenGenerator;
    private readonly clockProvider;
    private readonly passwordHasher;
    private readonly historyValidator;
    constructor(resetRepo: PasswordResetRepository, userRepo: UserRepository, userSessionService: UserSessionService, tokenGenerator: ITokenGenerator, clockProvider: IClockProvider, passwordHasher: IPasswordHasher, historyValidator: IPasswordHistoryValidator);
    requestReset(dto: RequestPasswordResetDto): Promise<PasswordResetToken>;
    verifyResetToken(token: string): Promise<PasswordResetResponseDto>;
    executeReset(dto: ExecutePasswordResetDto): Promise<void>;
}
