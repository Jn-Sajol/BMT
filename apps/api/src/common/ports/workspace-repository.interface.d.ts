import { IRepository } from './repository.port';
import { Workspace, WorkspaceSettings, WorkspacePreferences, WorkspaceMember } from '@prisma/client';
export interface IWorkspaceRepository extends IRepository<Workspace> {
    findBySlug(orgId: string, slug: string): Promise<Workspace | null>;
    findSettingsByWorkspaceId(workspaceId: string): Promise<WorkspaceSettings | null>;
    findPreferencesByWorkspaceId(workspaceId: string): Promise<WorkspacePreferences | null>;
    saveSettings(settings: WorkspaceSettings): Promise<WorkspaceSettings>;
    savePreferences(prefs: WorkspacePreferences): Promise<WorkspacePreferences>;
    findMembersByWorkspaceId(workspaceId: string): Promise<WorkspaceMember[]>;
    addMember(member: WorkspaceMember): Promise<WorkspaceMember>;
    removeMember(workspaceId: string, userId: string): Promise<void>;
}
