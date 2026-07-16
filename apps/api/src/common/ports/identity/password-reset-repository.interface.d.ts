import { IRepository } from '../repository.port';
import { PasswordResetToken } from '@prisma/client';
export interface IPasswordResetRepository extends IRepository<PasswordResetToken> {
    findByTokenHash(tokenHash: string): Promise<PasswordResetToken | null>;
    findLatestActiveToken(userId: string): Promise<PasswordResetToken | null>;
}
