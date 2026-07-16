import { UserInvitation } from '@prisma/client';
import { CreateUserInvitationDto } from '../../common/dto/identity.dto';
import { IUserInvitationService } from '../../common/ports/user-invitation-service.interface';
import { UserInvitationRepository } from '../../infrastructure/database/repositories/user-invitation.repository';
export declare class UserInvitationService implements IUserInvitationService {
    private readonly invitationRepo;
    constructor(invitationRepo: UserInvitationRepository);
    createInvitation(dto: CreateUserInvitationDto): Promise<UserInvitation>;
    acceptInvitation(id: string): Promise<void>;
    cancelInvitation(id: string): Promise<void>;
}
