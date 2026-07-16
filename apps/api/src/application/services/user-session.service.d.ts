import { UserSession } from '@prisma/client';
import { CreateSessionDto } from '../../common/dto/session.dto';
import { IUserSessionService } from '../../common/ports/user-session-service.interface';
import { UserSessionRepository } from '../../infrastructure/database/repositories/user-session.repository';
import { ITokenGenerator } from '../../common/ports/token-generator.interface';
import { IClockProvider } from '../../common/ports/clock-provider.interface';
export declare class UserSessionService implements IUserSessionService {
    private readonly sessionRepo;
    private readonly tokenGenerator;
    private readonly clockProvider;
    constructor(sessionRepo: UserSessionRepository, tokenGenerator: ITokenGenerator, clockProvider: IClockProvider);
    createSession(dto: CreateSessionDto): Promise<UserSession>;
    validateSession(tokenHash: string): Promise<UserSession | null>;
    revokeSession(id: string): Promise<void>;
    revokeAllSessionsByUserId(userId: string): Promise<void>;
    getActiveSessions(userId: string): Promise<UserSession[]>;
}
