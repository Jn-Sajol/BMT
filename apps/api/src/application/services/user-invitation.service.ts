import { Injectable } from '@nestjs/common';
import { UserInvitation } from '@prisma/client';
import { CreateUserInvitationDto } from '../../common/dto/identity.dto';
import { IUserInvitationService } from '../../common/ports/user-invitation-service.interface';
import { UserInvitationRepository } from '../../infrastructure/database/repositories/user-invitation.repository';
import { InvalidInvitationException } from '../../common/exceptions/domain-exceptions';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UserInvitationService implements IUserInvitationService {
  constructor(private readonly invitationRepo: UserInvitationRepository) {}

  async createInvitation(dto: CreateUserInvitationDto): Promise<UserInvitation> {
    const tokenHash = `${uuidv4()}_mock_invite_token`;
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 48); // Expire in 48 hours

    const invitation: UserInvitation = {
      id: '',
      email: dto.email,
      tenantId: dto.tenantId || null,
      workspaceId: dto.workspaceId || null,
      roleId: dto.roleId || null,
      tokenHash,
      status: 'PENDING',
      expiresAt,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
      createdBy: null,
      updatedBy: null,
    };

    return await this.invitationRepo.save(invitation);
  }

  async acceptInvitation(id: string): Promise<void> {
    const invitation = await this.invitationRepo.findById(id);
    if (!invitation || invitation.status !== 'PENDING') {
      throw new InvalidInvitationException('Invitation is not pending');
    }

    if (invitation.expiresAt < new Date()) {
      invitation.status = 'EXPIRED';
      await this.invitationRepo.save(invitation);
      throw new InvalidInvitationException('Invitation has expired');
    }

    invitation.status = 'ACCEPTED';
    await this.invitationRepo.save(invitation);
  }

  async cancelInvitation(id: string): Promise<void> {
    const invitation = await this.invitationRepo.findById(id);
    if (!invitation || invitation.status !== 'PENDING') {
      throw new InvalidInvitationException('Only pending invitations can be cancelled');
    }

    invitation.status = 'CANCELLED';
    await this.invitationRepo.save(invitation);
  }
}
