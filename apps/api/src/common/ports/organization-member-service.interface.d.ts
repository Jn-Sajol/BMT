import { OrganizationMember } from '@prisma/client';
import { CreateOrganizationMemberDto, UpdateOrganizationMemberDto, OrganizationMemberListDto } from '../dto/organization-member.dto';
export interface IOrganizationMemberService {
    addMember(dto: CreateOrganizationMemberDto): Promise<OrganizationMember>;
    getMember(orgId: string, userId: string): Promise<OrganizationMember | null>;
    updateMember(orgId: string, userId: string, dto: UpdateOrganizationMemberDto): Promise<OrganizationMember>;
    removeMember(orgId: string, userId: string): Promise<void>;
    listMembers(dto: OrganizationMemberListDto): Promise<OrganizationMember[]>;
}
