import { Injectable, Inject } from '@nestjs/common';
import { Organization } from '@prisma/client';
import { IOrganizationRepository } from '../../../common/ports/organization-repository.interface';
import { PRISMA_CLIENT } from '../constants';
import { ExtendedPrismaClient } from '../prisma-extensions';
import { mapPrismaError } from '../prisma-error.mapper';

@Injectable()
export class OrganizationRepository implements IOrganizationRepository {
  constructor(
    @Inject(PRISMA_CLIENT)
    private readonly prisma: ExtendedPrismaClient,
  ) {}

  async findById(id: string): Promise<Organization | null> {
    try {
      return await this.prisma.organization.findUnique({ where: { id } });
    } catch (e) {
      throw mapPrismaError(e) as Error;
    }
  }

  async findBySlug(slug: string): Promise<Organization | null> {
    try {
      return await this.prisma.organization.findUnique({ where: { slug } });
    } catch (e) {
      throw mapPrismaError(e) as Error;
    }
  }

  async findAll(): Promise<Organization[]> {
    try {
      return await this.prisma.organization.findMany();
    } catch (e) {
      throw mapPrismaError(e) as Error;
    }
  }

  async save(entity: Organization): Promise<Organization> {
    try {
      return await this.prisma.organization.upsert({
        where: { id: entity.id || '' },
        update: {
          name: entity.name,
          slug: entity.slug,
          status: entity.status,
          ownerUserId: entity.ownerUserId,
          deletedAt: entity.deletedAt,
        },
        create: {
          name: entity.name,
          slug: entity.slug,
          status: entity.status,
          ownerUserId: entity.ownerUserId,
          deletedAt: entity.deletedAt,
        },
      });
    } catch (e) {
      throw mapPrismaError(e) as Error;
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await this.prisma.organization.delete({ where: { id } });
    } catch (e) {
      throw mapPrismaError(e) as Error;
    }
  }
}
