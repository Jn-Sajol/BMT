import { WorkspaceType, WorkspaceStatus, WorkspaceVisibility } from '@prisma/client';
export declare class CreateWorkspaceDto {
    organizationId: string;
    name: string;
    slug: string;
    description?: string;
    workspaceType: WorkspaceType;
    visibility?: WorkspaceVisibility;
}
export declare class UpdateWorkspaceDto {
    name?: string;
    slug?: string;
    description?: string;
    visibility?: WorkspaceVisibility;
}
export declare class WorkspaceListDto {
    organizationId: string;
    limit?: number;
    offset?: number;
    status?: WorkspaceStatus;
}
export declare class UpdateWorkspaceSettingsDto {
    timezone?: string;
    language?: string;
    dateFormat?: string;
    timeFormat?: string;
    theme?: string;
    defaultLandingPage?: string;
    notificationPrefs?: Record<string, any>;
}
export declare class UpdateWorkspacePreferencesDto {
    preferences: Record<string, any>;
}
