import { OrganizationMember } from '@prisma/client';
import { OrganizationMemberResponseDto } from '../dto/organization-member-response.dto';

export class OrganizationMemberMapper {
  static toResponse(member: OrganizationMember): OrganizationMemberResponseDto {
    return {
      id: member.id,
      organizationId: member.organizationId,
      userId: member.userId,
      status: member.status,
      createdAt: member.createdAt.toISOString(),
      updatedAt: member.updatedAt.toISOString(),
    };
  }

  static toResponseList(members: OrganizationMember[]): OrganizationMemberResponseDto[] {
    return members.map(m => this.toResponse(m));
  }
}
