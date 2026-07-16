import { UserSession } from '@prisma/client';
import { IUserSessionRepository } from '../../../common/ports/user-session-repository.interface';
import { ExtendedPrismaClient } from '../prisma-extensions';
export declare class UserSessionRepository implements IUserSessionRepository {
    private readonly prisma;
    constructor(prisma: ExtendedPrismaClient);
    findById(id: string): Promise<UserSession | null>;
    findByTokenHash(tokenHash: string): Promise<UserSession | null>;
    findActiveSessionsByUserId(userId: string): Promise<UserSession[]>;
    findAll(): Promise<UserSession[]>;
    save(entity: UserSession): Promise<UserSession>;
    delete(id: string): Promise<void>;
    deleteExpiredSessions(userId: string): Promise<void>;
    deleteAllSessions(userId: string): Promise<void>;
}
