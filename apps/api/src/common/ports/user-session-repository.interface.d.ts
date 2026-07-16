import { IRepository } from './repository.port';
import { UserSession } from '@prisma/client';
export interface IUserSessionRepository extends IRepository<UserSession> {
    findByTokenHash(tokenHash: string): Promise<UserSession | null>;
    deleteExpiredSessions(userId: string): Promise<void>;
    deleteAllSessions(userId: string): Promise<void>;
    findActiveSessionsByUserId(userId: string): Promise<UserSession[]>;
}
