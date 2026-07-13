import { Injectable } from '@nestjs/common';
import { Workspace, WorkspaceSettings, WorkspacePreferences, WorkspaceMember } from '@prisma/client';
import { 
  CreateWorkspaceDto, 
  UpdateWorkspaceDto, 
  WorkspaceListDto,
  UpdateWorkspaceSettingsDto,
  UpdateWorkspacePreferencesDto
} from '../../common/dto/workspace.dto';
import { IWorkspaceService } from '../../common/ports/workspace-service.interface';
import { WorkspaceRepository } from '../../infrastructure/database/repositories/workspace.repository';
import { OrganizationRepository } from '../../infrastructure/database/repositories/organization.repository';
import { UserRepository } from '../../infrastructure/database/repositories/user.repository';
import { 
  WorkspaceNotFoundException, 
  DuplicateWorkspaceSlugException, 
  WorkspaceArchivedException,
  WorkspaceMemberAlreadyExistsException,
  WorkspaceMemberNotFoundException 
} from '../../common/exceptions/workspace-exceptions';
import { OrganizationNotFoundException } from '../../common/exceptions/organization-exceptions';

@Injectable()
export class WorkspaceService implements IWorkspaceService {
  constructor(
    private readonly workspaceRepo: WorkspaceRepository,
    private readonly orgRepo: OrganizationRepository,
    private readonly userRepo: UserRepository,
  ) {}

  async create(dto: CreateWorkspaceDto): Promise<Workspace> {
    // 1. Verify organization exists
    const org = await this.orgRepo.findById(dto.organizationId);
    if (!org || org.deletedAt) {
      throw new OrganizationNotFoundException(dto.organizationId);
    }

    // 2. Check duplicate slug in same organization
    const existing = await this.workspaceRepo.findBySlug(dto.organizationId, dto.slug);
    if (existing) {
      throw new DuplicateWorkspaceSlugException(dto.slug, dto.organizationId);
    }

    const ws: Workspace = {
      id: '',
      organizationId: dto.organizationId,
      name: dto.name,
      slug: dto.slug.toLowerCase(),
      description: dto.description || null,
      workspaceType: dto.workspaceType,
      visibility: dto.visibility || 'ORGANIZATION',
      status: 'ACTIVE',
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    };

    const savedWorkspace = await this.workspaceRepo.save(ws);

    // Initialize default workspace settings
    const defaultSettings: WorkspaceSettings = {
      id: '',
      workspaceId: savedWorkspace.id,
      timezone: 'UTC',
      language: 'en',
      dateFormat: 'YYYY-MM-DD',
      timeFormat: 'HH:mm:ss',
      theme: 'dark',
      defaultLandingPage: '/dashboard',
      notificationPrefs: {},
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    await this.workspaceRepo.saveSettings(defaultSettings);

    // Initialize default workspace preferences
    const defaultPrefs: WorkspacePreferences = {
      id: '',
      workspaceId: savedWorkspace.id,
      preferences: {},
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    await this.workspaceRepo.savePreferences(defaultPrefs);

    return savedWorkspace;
  }

  async findById(id: string): Promise<Workspace | null> {
    const ws = await this.workspaceRepo.findById(id);
    if (!ws || ws.deletedAt) {
      return null;
    }
    return ws;
  }

  async findBySlug(orgId: string, slug: string): Promise<Workspace | null> {
    const ws = await this.workspaceRepo.findBySlug(orgId, slug);
    if (!ws || ws.deletedAt) {
      return null;
    }
    return ws;
  }

  async update(id: string, dto: UpdateWorkspaceDto): Promise<Workspace> {
    const ws = await this.workspaceRepo.findById(id);
    if (!ws || ws.deletedAt) {
      throw new WorkspaceNotFoundException(id);
    }

    if (dto.slug && dto.slug.toLowerCase() !== ws.slug) {
      const existing = await this.workspaceRepo.findBySlug(ws.organizationId, dto.slug.toLowerCase());
      if (existing) {
        throw new DuplicateWorkspaceSlugException(dto.slug, ws.organizationId);
      }
      ws.slug = dto.slug.toLowerCase();
    }

    if (dto.name) {
      ws.name = dto.name;
    }

    if (dto.description !== undefined) {
      ws.description = dto.description;
    }

    if (dto.visibility) {
      ws.visibility = dto.visibility;
    }

    ws.updatedAt = new Date();
    return await this.workspaceRepo.save(ws);
  }

  async archive(id: string): Promise<Workspace> {
    const ws = await this.workspaceRepo.findById(id);
    if (!ws || ws.deletedAt) {
      throw new WorkspaceNotFoundException(id);
    }

    ws.status = 'ARCHIVED';
    ws.deletedAt = new Date(); // Soft delete active
    ws.updatedAt = new Date();
    return await this.workspaceRepo.save(ws);
  }

  async restore(id: string): Promise<Workspace> {
    const ws = await this.workspaceRepo.findById(id);
    if (!ws) {
      throw new WorkspaceNotFoundException(id);
    }

    ws.status = 'ACTIVE';
    ws.deletedAt = null;
    ws.updatedAt = new Date();
    return await this.workspaceRepo.save(ws);
  }

  async list(dto: WorkspaceListDto): Promise<Workspace[]> {
    const list = await this.workspaceRepo.findAll();
    let filtered = list.filter(w => w.organizationId === dto.organizationId);

    if (dto.status) {
      filtered = filtered.filter(w => w.status === dto.status);
    }

    const limit = dto.limit || 10;
    const offset = dto.offset || 0;

    return filtered.slice(offset, offset + limit);
  }

  async getSettings(workspaceId: string): Promise<WorkspaceSettings | null> {
    const ws = await this.workspaceRepo.findById(workspaceId);
    if (!ws || ws.deletedAt) {
      throw new WorkspaceNotFoundException(workspaceId);
    }
    return await this.workspaceRepo.findSettingsByWorkspaceId(workspaceId);
  }

  async updateSettings(workspaceId: string, dto: UpdateWorkspaceSettingsDto): Promise<WorkspaceSettings> {
    const ws = await this.workspaceRepo.findById(workspaceId);
    if (!ws || ws.deletedAt) {
      throw new WorkspaceNotFoundException(workspaceId);
    }

    let settings = await this.workspaceRepo.findSettingsByWorkspaceId(workspaceId);
    if (!settings) {
      settings = {
        id: '',
        workspaceId,
        timezone: 'UTC',
        language: 'en',
        dateFormat: 'YYYY-MM-DD',
        timeFormat: 'HH:mm:ss',
        theme: 'dark',
        defaultLandingPage: '/dashboard',
        notificationPrefs: {},
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    }

    if (dto.timezone) settings.timezone = dto.timezone;
    if (dto.language) settings.language = dto.language;
    if (dto.dateFormat) settings.dateFormat = dto.dateFormat;
    if (dto.timeFormat) settings.timeFormat = dto.timeFormat;
    if (dto.theme) settings.theme = dto.theme;
    if (dto.defaultLandingPage) settings.defaultLandingPage = dto.defaultLandingPage;
    if (dto.notificationPrefs) settings.notificationPrefs = dto.notificationPrefs;

    settings.updatedAt = new Date();
    return await this.workspaceRepo.saveSettings(settings);
  }

  async getPreferences(workspaceId: string): Promise<WorkspacePreferences | null> {
    const ws = await this.workspaceRepo.findById(workspaceId);
    if (!ws || ws.deletedAt) {
      throw new WorkspaceNotFoundException(workspaceId);
    }
    return await this.workspaceRepo.findPreferencesByWorkspaceId(workspaceId);
  }

  async updatePreferences(workspaceId: string, dto: UpdateWorkspacePreferencesDto): Promise<WorkspacePreferences> {
    const ws = await this.workspaceRepo.findById(workspaceId);
    if (!ws || ws.deletedAt) {
      throw new WorkspaceNotFoundException(workspaceId);
    }

    let prefs = await this.workspaceRepo.findPreferencesByWorkspaceId(workspaceId);
    if (!prefs) {
      prefs = {
        id: '',
        workspaceId,
        preferences: {},
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    }

    prefs.preferences = dto.preferences;
    prefs.updatedAt = new Date();
    return await this.workspaceRepo.savePreferences(prefs);
  }

  async getMembers(workspaceId: string): Promise<WorkspaceMember[]> {
    const ws = await this.workspaceRepo.findById(workspaceId);
    if (!ws || ws.deletedAt) {
      throw new WorkspaceNotFoundException(workspaceId);
    }
    return await this.workspaceRepo.findMembersByWorkspaceId(workspaceId);
  }

  async addMember(workspaceId: string, userId: string): Promise<WorkspaceMember> {
    const ws = await this.workspaceRepo.findById(workspaceId);
    if (!ws || ws.deletedAt) {
      throw new WorkspaceNotFoundException(workspaceId);
    }

    const user = await this.userRepo.findById(userId);
    if (!user || user.deletedAt) {
      throw new Error(`User with ID '${userId}' not found`);
    }

    const members = await this.workspaceRepo.findMembersByWorkspaceId(workspaceId);
    if (members.some(m => m.userId === userId)) {
      throw new WorkspaceMemberAlreadyExistsException(workspaceId, userId);
    }

    const member: WorkspaceMember = {
      id: '',
      workspaceId,
      userId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    return await this.workspaceRepo.addMember(member);
  }

  async removeMember(workspaceId: string, userId: string): Promise<void> {
    const ws = await this.workspaceRepo.findById(workspaceId);
    if (!ws || ws.deletedAt) {
      throw new WorkspaceNotFoundException(workspaceId);
    }

    const members = await this.workspaceRepo.findMembersByWorkspaceId(workspaceId);
    if (!members.some(m => m.userId === userId)) {
      throw new WorkspaceMemberNotFoundException(workspaceId, userId);
    }

    await this.workspaceRepo.removeMember(workspaceId, userId);
  }
}
