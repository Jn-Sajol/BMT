import { Injectable, Inject } from '@nestjs/common';
import { Workspace, WorkspaceSettings, WorkspacePreferences, WorkspaceMember } from '@prisma/client';
import { IWorkspaceRepository } from '../../../common/ports/workspace-repository.interface';
import { PRISMA_CLIENT } from '../constants';
import { ExtendedPrismaClient } from '../prisma-extensions';
import { mapPrismaError } from '../prisma-error.mapper';

@Injectable()
export class WorkspaceRepository implements IWorkspaceRepository {
  constructor(
    @Inject(PRISMA_CLIENT)
    private readonly prisma: ExtendedPrismaClient,
  ) {}

  async findById(id: string): Promise<Workspace | null> {
    try {
      return await this.prisma.workspace.findUnique({ where: { id } });
    } catch (e) {
      throw mapPrismaError(e) as Error;
    }
  }

  async findBySlug(orgId: string, slug: string): Promise<Workspace | null> {
    try {
      return await this.prisma.workspace.findUnique({
        where: {
          organizationId_slug: {
            organizationId: orgId,
            slug,
          },
        },
      });
    } catch (e) {
      throw mapPrismaError(e) as Error;
    }
  }

  async findAll(): Promise<Workspace[]> {
    try {
      return await this.prisma.workspace.findMany();
    } catch (e) {
      throw mapPrismaError(e) as Error;
    }
  }

  async save(entity: Workspace): Promise<Workspace> {
    try {
      return await this.prisma.workspace.upsert({
        where: { id: entity.id || '' },
        update: {
          name: entity.name,
          slug: entity.slug,
          description: entity.description,
          workspaceType: entity.workspaceType,
          visibility: entity.visibility,
          status: entity.status,
          deletedAt: entity.deletedAt,
        },
        create: {
          organizationId: entity.organizationId,
          name: entity.name,
          slug: entity.slug,
          description: entity.description,
          workspaceType: entity.workspaceType,
          visibility: entity.visibility,
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
      await this.prisma.workspace.delete({ where: { id } });
    } catch (e) {
      throw mapPrismaError(e) as Error;
    }
  }

  async findSettingsByWorkspaceId(workspaceId: string): Promise<WorkspaceSettings | null> {
    try {
      return await this.prisma.workspaceSettings.findUnique({ where: { workspaceId } });
    } catch (e) {
      throw mapPrismaError(e) as Error;
    }
  }

  async findPreferencesByWorkspaceId(workspaceId: string): Promise<WorkspacePreferences | null> {
    try {
      return await this.prisma.workspacePreferences.findUnique({ where: { workspaceId } });
    } catch (e) {
      throw mapPrismaError(e) as Error;
    }
  }

  async saveSettings(settings: WorkspaceSettings): Promise<WorkspaceSettings> {
    try {
      return await this.prisma.workspaceSettings.upsert({
        where: { workspaceId: settings.workspaceId },
        update: {
          timezone: settings.timezone,
          language: settings.language,
          dateFormat: settings.dateFormat,
          timeFormat: settings.timeFormat,
          theme: settings.theme,
          defaultLandingPage: settings.defaultLandingPage,
          notificationPrefs: settings.notificationPrefs || {},
        },
        create: {
          workspaceId: settings.workspaceId,
          timezone: settings.timezone,
          language: settings.language,
          dateFormat: settings.dateFormat,
          timeFormat: settings.timeFormat,
          theme: settings.theme,
          defaultLandingPage: settings.defaultLandingPage,
          notificationPrefs: settings.notificationPrefs || {},
        },
      });
    } catch (e) {
      throw mapPrismaError(e) as Error;
    }
  }

  async savePreferences(prefs: WorkspacePreferences): Promise<WorkspacePreferences> {
    try {
      return await this.prisma.workspacePreferences.upsert({
        where: { workspaceId: prefs.workspaceId },
        update: {
          preferences: prefs.preferences || {},
        },
        create: {
          workspaceId: prefs.workspaceId,
          preferences: prefs.preferences || {},
        },
      });
    } catch (e) {
      throw mapPrismaError(e) as Error;
    }
  }

  async findMembersByWorkspaceId(workspaceId: string): Promise<WorkspaceMember[]> {
    try {
      return await this.prisma.workspaceMember.findMany({ where: { workspaceId } });
    } catch (e) {
      throw mapPrismaError(e) as Error;
    }
  }

  async addMember(member: WorkspaceMember): Promise<WorkspaceMember> {
    try {
      return await this.prisma.workspaceMember.create({
        data: {
          workspaceId: member.workspaceId,
          userId: member.userId,
        },
      });
    } catch (e) {
      throw mapPrismaError(e) as Error;
    }
  }

  async removeMember(workspaceId: string, userId: string): Promise<void> {
    try {
      await this.prisma.workspaceMember.delete({
        where: {
          workspaceId_userId: {
            workspaceId,
            userId,
          },
        },
      });
    } catch (e) {
      throw mapPrismaError(e) as Error;
    }
  }
}
