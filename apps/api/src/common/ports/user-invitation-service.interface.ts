import { UserInvitation } from '@prisma/client';
import { CreateUserInvitationDto } from '../dto/identity.dto';

export interface IUserInvitationService {
  createInvitation(dto: CreateUserInvitationDto): Promise<UserInvitation>;
  acceptInvitation(id: string): Promise<void>;
  cancelInvitation(id: string): Promise<void>;
}
