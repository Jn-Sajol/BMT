import { Injectable, Inject } from '@nestjs/common';
import { OrganizationMember } from '@prisma/client';
import { IOrganizationMemberRepository } from '../../../common/ports/organization-member-repository.interface';
import { PRISMA_CLIENT } from '../constants';
import { ExtendedPrismaClient } from '../prisma-extensions';
import { mapPrismaError } from '../prisma-error.mapper';

@Injectable()
export class OrganizationMemberRepository implements IOrganizationMemberRepository {
  constructor(
    @Inject(PRISMA_CLIENT)
    private readonly prisma: ExtendedPrismaClient,
  ) {}

  async findById(id: string): Promise<OrganizationMember | null> {
    try {
      return await this.prisma.organizationMember.findUnique({ where: { id } });
    } catch (e) {
      throw mapPrismaError(e) as Error;
    }
  }

  async findByOrgAndUser(orgId: string, userId: string): Promise<OrganizationMember | null> {
    try {
      return await this.prisma.organizationMember.findUnique({
        where: {
          organizationId_userId: {
            organizationId: orgId,
            userId,
          },
        },
      });
    } catch (e) {
      throw mapPrismaError(e) as Error;
    }
  }

  async findMembersByOrgId(orgId: string): Promise<OrganizationMember[]> {
    try {
      return await this.prisma.organizationMember.findMany({
        where: { organizationId: orgId },
      });
    } catch (e) {
      throw mapPrismaError(e) as Error;
    }
  }

  async findAll(): Promise<OrganizationMember[]> {
    try {
      return await this.prisma.organizationMember.findMany();
    } catch (e) {
      throw mapPrismaError(e) as Error;
    }
  }

  async save(entity: OrganizationMember): Promise<OrganizationMember> {
    try {
      return await this.prisma.organizationMember.upsert({
        where: { id: entity.id || '' },
        update: {
          status: entity.status,
          deletedAt: entity.deletedAt,
        },
        create: {
          organizationId: entity.organizationId,
          userId: entity.userId,
          status: entity.status,
          deletedAt: entity.deletedAt,
        },
      });
    } catch (e) {
      throw mapPrismaError(e) as Error;
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await this.prisma.organizationMember.delete({ where: { id } });
    } catch (e) {
      throw mapPrismaError(e) as Error;
    }
  }
}
