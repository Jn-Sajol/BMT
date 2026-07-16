import { UserInvitation } from '@prisma/client';
import { IUserInvitationRepository } from '../../../common/ports/user-invitation-repository.interface';
import { ExtendedPrismaClient } from '../prisma-extensions';
export declare class UserInvitationRepository implements IUserInvitationRepository {
    private readonly prisma;
    constructor(prisma: ExtendedPrismaClient);
    findById(id: string): Promise<UserInvitation | null>;
    findByTokenHash(tokenHash: string): Promise<UserInvitation | null>;
    findPendingByEmail(email: string): Promise<UserInvitation[]>;
    findAll(): Promise<UserInvitation[]>;
    save(entity: UserInvitation): Promise<UserInvitation>;
    delete(id: string): Promise<void>;
}
