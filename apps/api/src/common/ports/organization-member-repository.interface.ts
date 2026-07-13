import { IRepository } from './repository.port';
import { OrganizationMember } from '@prisma/client';

export interface IOrganizationMemberRepository extends IRepository<OrganizationMember> {
  findByOrgAndUser(orgId: string, userId: string): Promise<OrganizationMember | null>;
  findMembersByOrgId(orgId: string): Promise<OrganizationMember[]>;
}
