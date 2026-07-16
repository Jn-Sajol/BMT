import { IRepository } from './repository.port';
import { UserInvitation } from '@prisma/client';
export interface IUserInvitationRepository extends IRepository<UserInvitation> {
    findByTokenHash(tokenHash: string): Promise<UserInvitation | null>;
    findPendingByEmail(email: string): Promise<UserInvitation[]>;
}
