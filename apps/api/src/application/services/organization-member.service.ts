import { Injectable } from '@nestjs/common';
import { OrganizationMember, MembershipStatus } from '@prisma/client';
import { 
  CreateOrganizationMemberDto, 
  UpdateOrganizationMemberDto, 
  OrganizationMemberListDto 
} from '../../common/dto/organization-member.dto';
import { IOrganizationMemberService } from '../../common/ports/organization-member-service.interface';
import { OrganizationMemberRepository } from '../../infrastructure/database/repositories/organization-member.repository';
import { OrganizationRepository } from '../../infrastructure/database/repositories/organization.repository';
import { UserRepository } from '../../infrastructure/database/repositories/user.repository';
import { 
  OrganizationMemberNotFoundException, 
  DuplicateMembershipException, 
  InvalidStatusTransitionException, 
  OwnerRemovalException 
} from '../../common/exceptions/organization-member-exceptions';
import { OrganizationNotFoundException } from '../../common/exceptions/organization-exceptions';

@Injectable()
export class OrganizationMemberService implements IOrganizationMemberService {
  constructor(
    private readonly memberRepo: OrganizationMemberRepository,
    private readonly orgRepo: OrganizationRepository,
    private readonly userRepo: UserRepository,
  ) {}

  async addMember(dto: CreateOrganizationMemberDto): Promise<OrganizationMember> {
    // 1. Verify organization exists
    const org = await this.orgRepo.findById(dto.organizationId);
    if (!org || org.deletedAt) {
      throw new OrganizationNotFoundException(dto.organizationId);
    }

    // 2. Verify user exists
    const user = await this.userRepo.findById(dto.userId);
    if (!user || user.deletedAt) {
      throw new Error(`User with ID '${dto.userId}' not found`);
    }

    // 3. Verify duplicate membership
    const existing = await this.memberRepo.findByOrgAndUser(dto.organizationId, dto.userId);
    if (existing && !existing.deletedAt) {
      throw new DuplicateMembershipException(dto.organizationId, dto.userId);
    }

    const member: OrganizationMember = {
      id: existing ? existing.id : '',
      organizationId: dto.organizationId,
      userId: dto.userId,
      status: dto.status || MembershipStatus.ACTIVE,
      roleId: null,
      createdAt: existing ? existing.createdAt : new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    };

    return await this.memberRepo.save(member);
  }

  async getMember(orgId: string, userId: string): Promise<OrganizationMember | null> {
    const member = await this.memberRepo.findByOrgAndUser(orgId, userId);
    if (!member || member.deletedAt) {
      return null;
    }
    return member;
  }

  async updateMember(orgId: string, userId: string, dto: UpdateOrganizationMemberDto): Promise<OrganizationMember> {
    const member = await this.memberRepo.findByOrgAndUser(orgId, userId);
    if (!member || member.deletedAt) {
      throw new OrganizationMemberNotFoundException(orgId, userId);
    }

    // Enforce owner membership rule
    const org = await this.orgRepo.findById(orgId);
    if (org && org.ownerUserId === userId && dto.status !== MembershipStatus.ACTIVE) {
      throw new OwnerRemovalException(userId, orgId);
    }

    // Validate status transitions
    const validTransitions: Record<MembershipStatus, MembershipStatus[]> = {
      [MembershipStatus.INVITED]: [MembershipStatus.ACTIVE, MembershipStatus.REMOVED],
      [MembershipStatus.ACTIVE]: [MembershipStatus.SUSPENDED, MembershipStatus.REMOVED],
      [MembershipStatus.SUSPENDED]: [MembershipStatus.ACTIVE, MembershipStatus.REMOVED],
      [MembershipStatus.REMOVED]: [MembershipStatus.ACTIVE],
    };

    if (!validTransitions[member.status].includes(dto.status)) {
      throw new InvalidStatusTransitionException(member.status, dto.status);
    }

    member.status = dto.status;
    member.updatedAt = new Date();
    return await this.memberRepo.save(member);
  }

  async removeMember(orgId: string, userId: string): Promise<void> {
    const member = await this.memberRepo.findByOrgAndUser(orgId, userId);
    if (!member || member.deletedAt) {
      throw new OrganizationMemberNotFoundException(orgId, userId);
    }

    // Enforce owner membership rule
    const org = await this.orgRepo.findById(orgId);
    if (org && org.ownerUserId === userId) {
      throw new OwnerRemovalException(userId, orgId);
    }

    member.status = MembershipStatus.REMOVED;
    member.deletedAt = new Date(); // Soft delete active
    member.updatedAt = new Date();
    await this.memberRepo.save(member);
  }

  async listMembers(dto: OrganizationMemberListDto): Promise<OrganizationMember[]> {
    const list = await this.memberRepo.findMembersByOrgId(dto.organizationId);
    let filtered = list;

    if (dto.status) {
      filtered = filtered.filter(m => m.status === dto.status);
    }

    const limit = dto.limit || 10;
    const offset = dto.offset || 0;

    return filtered.slice(offset, offset + limit);
  }
}
