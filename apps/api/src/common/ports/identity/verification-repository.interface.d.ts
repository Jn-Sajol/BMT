import { IRepository } from '../repository.port';
import { VerificationToken } from '@prisma/client';
export interface IVerificationRepository extends IRepository<VerificationToken> {
    findByTokenHash(tokenHash: string): Promise<VerificationToken | null>;
    findLatestActiveToken(userId: string, tokenType: string): Promise<VerificationToken | null>;
}
