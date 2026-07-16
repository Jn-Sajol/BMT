import { PasswordResetToken } from '@prisma/client';
import { IPasswordResetRepository } from '../../../common/ports/identity/password-reset-repository.interface';
import { ExtendedPrismaClient } from '../prisma-extensions';
export declare class PasswordResetRepository implements IPasswordResetRepository {
    private readonly prisma;
    constructor(prisma: ExtendedPrismaClient);
    findById(id: string): Promise<PasswordResetToken | null>;
    findByTokenHash(tokenHash: string): Promise<PasswordResetToken | null>;
    findLatestActiveToken(userId: string): Promise<PasswordResetToken | null>;
    findAll(): Promise<PasswordResetToken[]>;
    save(entity: PasswordResetToken): Promise<PasswordResetToken>;
    delete(id: string): Promise<void>;
}
