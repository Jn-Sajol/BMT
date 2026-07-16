import { OrganizationMember } from '@prisma/client';
import { IOrganizationMemberRepository } from '../../../common/ports/organization-member-repository.interface';
import { ExtendedPrismaClient } from '../prisma-extensions';
export declare class OrganizationMemberRepository implements IOrganizationMemberRepository {
    private readonly prisma;
    constructor(prisma: ExtendedPrismaClient);
    findById(id: string): Promise<OrganizationMember | null>;
    findByOrgAndUser(orgId: string, userId: string): Promise<OrganizationMember | null>;
    findMembersByOrgId(orgId: string): Promise<OrganizationMember[]>;
    findAll(): Promise<OrganizationMember[]>;
    save(entity: OrganizationMember): Promise<OrganizationMember>;
    delete(id: string): Promise<void>;
}
