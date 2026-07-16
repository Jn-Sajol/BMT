import { Workspace, WorkspaceSettings, WorkspacePreferences, WorkspaceMember } from '@prisma/client';
import { IWorkspaceRepository } from '../../../common/ports/workspace-repository.interface';
import { ExtendedPrismaClient } from '../prisma-extensions';
export declare class WorkspaceRepository implements IWorkspaceRepository {
    private readonly prisma;
    constructor(prisma: ExtendedPrismaClient);
    findById(id: string): Promise<Workspace | null>;
    findBySlug(orgId: string, slug: string): Promise<Workspace | null>;
    findAll(): Promise<Workspace[]>;
    save(entity: Workspace): Promise<Workspace>;
    delete(id: string): Promise<void>;
    findSettingsByWorkspaceId(workspaceId: string): Promise<WorkspaceSettings | null>;
    findPreferencesByWorkspaceId(workspaceId: string): Promise<WorkspacePreferences | null>;
    saveSettings(settings: WorkspaceSettings): Promise<WorkspaceSettings>;
    savePreferences(prefs: WorkspacePreferences): Promise<WorkspacePreferences>;
    findMembersByWorkspaceId(workspaceId: string): Promise<WorkspaceMember[]>;
    addMember(member: WorkspaceMember): Promise<WorkspaceMember>;
    removeMember(workspaceId: string, userId: string): Promise<void>;
}
