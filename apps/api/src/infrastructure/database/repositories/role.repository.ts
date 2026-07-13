import { Injectable, Inject } from '@nestjs/common';
import { Role, RolePermission } from '@prisma/client';
import { IRoleRepository } from '../../../common/ports/identity/role-repository.interface';
import { PRISMA_CLIENT } from '../constants';
import { ExtendedPrismaClient } from '../prisma-extensions';
import { mapPrismaError } from '../prisma-error.mapper';

@Injectable()
export class RoleRepository implements IRoleRepository {
  constructor(
    @Inject(PRISMA_CLIENT)
    private readonly prisma: ExtendedPrismaClient,
  ) {}

  async findById(id: string): Promise<Role | null> {
    try {
      return await this.prisma.role.findUnique({
        where: { id },
        include: {
          permissions: {
            include: {
              permission: true,
            },
          },
        },
      });
    } catch (e) {
      throw mapPrismaError(e) as Error;
    }
  }

  async findByName(name: string): Promise<Role | null> {
    try {
      return await this.prisma.role.findUnique({
        where: { name },
        include: {
          permissions: {
            include: {
              permission: true,
            },
          },
        },
      });
    } catch (e) {
      throw mapPrismaError(e) as Error;
    }
  }

  async findRolesByUserIdForWorkspace(userId: string, workspaceId: string): Promise<Role[]> {
    try {
      const mappings = await this.prisma.userWorkspaceRole.findMany({
        where: { userId, workspaceId },
        include: {
          role: {
            include: {
              permissions: {
                include: {
                  permission: true,
                },
              },
            },
          },
        },
      });
      return mappings.map((m) => m.role);
    } catch (e) {
      throw mapPrismaError(e) as Error;
    }
  }

  async findRolesByUserIdForOrganization(userId: string, organizationId: string): Promise<Role[]> {
    try {
      const membership = await this.prisma.organizationMember.findUnique({
        where: {
          organizationId_userId: {
            organizationId,
            userId,
          },
        },
        include: {
          role: {
            include: {
              permissions: {
                include: {
                  permission: true,
                },
              },
            },
          },
        },
      });
      return membership && membership.role ? [membership.role] : [];
    } catch (e) {
      throw mapPrismaError(e) as Error;
    }
  }

  async assignPermissionToRole(roleId: string, permissionId: string): Promise<RolePermission> {
    try {
      return await this.prisma.rolePermission.create({
        data: {
          roleId,
          permissionId,
        },
      });
    } catch (e) {
      throw mapPrismaError(e) as Error;
    }
  }

  async revokePermissionFromRole(roleId: string, permissionId: string): Promise<void> {
    try {
      await this.prisma.rolePermission.delete({
        where: {
          roleId_permissionId: {
            roleId,
            permissionId,
          },
        },
      });
    } catch (e) {
      throw mapPrismaError(e) as Error;
    }
  }

  async assignWorkspaceRole(userId: string, workspaceId: string, roleId: string): Promise<void> {
    try {
      await this.prisma.userWorkspaceRole.upsert({
        where: {
          userId_workspaceId_roleId: {
            userId,
            workspaceId,
            roleId,
          },
        },
        update: {},
        create: {
          userId,
          workspaceId,
          roleId,
        },
      });
    } catch (e) {
      throw mapPrismaError(e) as Error;
    }
  }

  async revokeWorkspaceRole(userId: string, workspaceId: string, roleId: string): Promise<void> {
    try {
      await this.prisma.userWorkspaceRole.delete({
        where: {
          userId_workspaceId_roleId: {
            userId,
            workspaceId,
            roleId,
          },
        },
      });
    } catch (e) {
      throw mapPrismaError(e) as Error;
    }
  }

  async assignOrganizationRole(userId: string, organizationId: string, roleId: string): Promise<void> {
    try {
      await this.prisma.organizationMember.update({
        where: {
          organizationId_userId: {
            organizationId,
            userId,
          },
        },
        data: {
          roleId,
        },
      });
    } catch (e) {
      throw mapPrismaError(e) as Error;
    }
  }

  async findUserWorkspaceRoles(userId: string): Promise<any[]> {
    try {
      return await this.prisma.userWorkspaceRole.findMany({
        where: { userId },
        include: {
          workspace: true,
          role: true,
        },
      });
    } catch (e) {
      throw mapPrismaError(e) as Error;
    }
  }

  async findUserOrganizationRoles(userId: string): Promise<any[]> {
    try {
      return await this.prisma.organizationMember.findMany({
        where: { userId },
        include: {
          organization: true,
          role: true,
        },
      });
    } catch (e) {
      throw mapPrismaError(e) as Error;
    }
  }

  async findAll(): Promise<Role[]> {
    try {
      return await this.prisma.role.findMany();
    } catch (e) {
      throw mapPrismaError(e) as Error;
    }
  }

  async save(entity: Role): Promise<Role> {
    try {
      return await this.prisma.role.upsert({
        where: { id: entity.id || '' },
        update: {
          name: entity.name,
          description: entity.description,
          roleType: entity.roleType,
        },
        create: {
          name: entity.name,
          description: entity.description,
          roleType: entity.roleType,
        },
      });
    } catch (e) {
      throw mapPrismaError(e) as Error;
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await this.prisma.role.delete({ where: { id } });
    } catch (e) {
      throw mapPrismaError(e) as Error;
    }
  }
}
