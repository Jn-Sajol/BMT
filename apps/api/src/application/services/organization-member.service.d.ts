import { OrganizationMember } from '@prisma/client';
import { CreateOrganizationMemberDto, UpdateOrganizationMemberDto, OrganizationMemberListDto } from '../../common/dto/organization-member.dto';
import { IOrganizationMemberService } from '../../common/ports/organization-member-service.interface';
import { OrganizationMemberRepository } from '../../infrastructure/database/repositories/organization-member.repository';
import { OrganizationRepository } from '../../infrastructure/database/repositories/organization.repository';
import { UserRepository } from '../../infrastructure/database/repositories/user.repository';
export declare class OrganizationMemberService implements IOrganizationMemberService {
    private readonly memberRepo;
    private readonly orgRepo;
    private readonly userRepo;
    constructor(memberRepo: OrganizationMemberRepository, orgRepo: OrganizationRepository, userRepo: UserRepository);
    addMember(dto: CreateOrganizationMemberDto): Promise<OrganizationMember>;
    getMember(orgId: string, userId: string): Promise<OrganizationMember | null>;
    updateMember(orgId: string, userId: string, dto: UpdateOrganizationMemberDto): Promise<OrganizationMember>;
    removeMember(orgId: string, userId: string): Promise<void>;
    listMembers(dto: OrganizationMemberListDto): Promise<OrganizationMember[]>;
}
