import { Workspace, WorkspaceSettings, WorkspacePreferences, WorkspaceMember } from '@prisma/client';
import { CreateWorkspaceDto, UpdateWorkspaceDto, WorkspaceListDto, UpdateWorkspaceSettingsDto, UpdateWorkspacePreferencesDto } from '../dto/workspace.dto';
export interface IWorkspaceService {
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
