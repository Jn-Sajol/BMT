import { Workspace, WorkspaceSettings, WorkspacePreferences, WorkspaceMember } from '@prisma/client';
import { CreateWorkspaceDto, UpdateWorkspaceDto, WorkspaceListDto, UpdateWorkspaceSettingsDto, UpdateWorkspacePreferencesDto } from '../../common/dto/workspace.dto';
import { IWorkspaceService } from '../../common/ports/workspace-service.interface';
import { WorkspaceRepository } from '../../infrastructure/database/repositories/workspace.repository';
import { OrganizationRepository } from '../../infrastructure/database/repositories/organization.repository';
import { UserRepository } from '../../infrastructure/database/repositories/user.repository';
export declare class WorkspaceService implements IWorkspaceService {
    private readonly workspaceRepo;
    private readonly orgRepo;
    private readonly userRepo;
    constructor(workspaceRepo: WorkspaceRepository, orgRepo: OrganizationRepository, userRepo: UserRepository);
    create(dto: CreateWorkspaceDto): Promise<Workspace>;
    findById(id: string): Promise<Workspace | null>;
    findBySlug(orgId: string, slug: string): Promise<Workspace | null>;
    update(id: string, dto: UpdateWorkspaceDto): Promise<Workspace>;
    archive(id: string): Promise<Workspace>;
    restore(id: string): Promise<Workspace>;
    list(dto: WorkspaceListDto): Promise<Workspace[]>;
    getSettings(workspaceId: string): Promise<WorkspaceSettings | null>;
    updateSettings(workspaceId: string, dto: UpdateWorkspaceSettingsDto): Promise<WorkspaceSettings>;
    getPreferences(workspaceId: string): Promise<WorkspacePreferences | null>;
    updatePreferences(workspaceId: string, dto: UpdateWorkspacePreferencesDto): Promise<WorkspacePreferences>;
    getMembers(workspaceId: string): Promise<WorkspaceMember[]>;
    addMember(workspaceId: string, userId: string): Promise<WorkspaceMember>;
    removeMember(workspaceId: string, userId: string): Promise<void>;
}
