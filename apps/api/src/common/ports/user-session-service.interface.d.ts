import { UserSession } from '@prisma/client';
import { CreateSessionDto } from '../dto/session.dto';
export interface IUserSessionService {
    createSession(dto: CreateSessionDto): Promise<UserSession>;
    validateSession(tokenHash: string): Promise<UserSession | null>;
    revokeSession(id: string): Promise<void>;
    revokeAllSessionsByUserId(userId: string): Promise<void>;
    getActiveSessions(userId: string): Promise<UserSession[]>;
}
