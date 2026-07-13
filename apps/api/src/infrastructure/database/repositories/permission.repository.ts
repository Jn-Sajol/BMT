import { Injectable, Inject } from '@nestjs/common';
import { Permission } from '@prisma/client';
import { IPermissionRepository } from '../../../common/ports/identity/permission-repository.interface';
import { PRISMA_CLIENT } from '../constants';
import { ExtendedPrismaClient } from '../prisma-extensions';
import { mapPrismaError } from '../prisma-error.mapper';

@Injectable()
export class PermissionRepository implements IPermissionRepository {
  constructor(
    @Inject(PRISMA_CLIENT)
    private readonly prisma: ExtendedPrismaClient,
  ) {}

  async findById(id: string): Promise<Permission | null> {
    try {
      return await this.prisma.permission.findUnique({ where: { id } });
    } catch (e) {
      throw mapPrismaError(e) as Error;
    }
  }

  async findByActionKey(actionKey: string): Promise<Permission | null> {
    try {
      return await this.prisma.permission.findUnique({ where: { actionKey } });
    } catch (e) {
      throw mapPrismaError(e) as Error;
    }
  }

  async findManyByActionKeys(actionKeys: string[]): Promise<Permission[]> {
    try {
      return await this.prisma.permission.findMany({
        where: {
          actionKey: {
            in: actionKeys,
          },
        },
      });
    } catch (e) {
      throw mapPrismaError(e) as Error;
    }
  }

  async findAll(): Promise<Permission[]> {
    try {
      return await this.prisma.permission.findMany();
    } catch (e) {
      throw mapPrismaError(e) as Error;
    }
  }

  async save(entity: Permission): Promise<Permission> {
    try {
      return await this.prisma.permission.upsert({
        where: { id: entity.id || '' },
        update: {
          actionKey: entity.actionKey,
          description: entity.description,
        },
        create: {
          actionKey: entity.actionKey,
          description: entity.description,
        },
      });
    } catch (e) {
      throw mapPrismaError(e) as Error;
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await this.prisma.permission.delete({ where: { id } });
    } catch (e) {
      throw mapPrismaError(e) as Error;
    }
  }
}
