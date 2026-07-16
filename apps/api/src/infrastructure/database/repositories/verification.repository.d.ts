import { VerificationToken } from '@prisma/client';
import { IVerificationRepository } from '../../../common/ports/identity/verification-repository.interface';
import { ExtendedPrismaClient } from '../prisma-extensions';
export declare class VerificationRepository implements IVerificationRepository {
    private readonly prisma;
    constructor(prisma: ExtendedPrismaClient);
    findById(id: string): Promise<VerificationToken | null>;
    findByTokenHash(tokenHash: string): Promise<VerificationToken | null>;
    findLatestActiveToken(userId: string, tokenType: string): Promise<VerificationToken | null>;
    findAll(): Promise<VerificationToken[]>;
    save(entity: VerificationToken): Promise<VerificationToken>;
    delete(id: string): Promise<void>;
}
