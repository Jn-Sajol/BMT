export declare class WorkspaceResponseDto {
    id: string;
    organizationId: string;
    name: string;
    slug: string;
    description?: string | null;
    workspaceType: string;
    visibility: string;
    status: string;
    createdAt: string;
    updatedAt: string;
}
export declare class WorkspaceSettingsResponseDto {
    id: string;
    workspaceId: string;
    timezone: string;
    language: string;
    dateFormat: string;
    timeFormat: string;
    theme: string;
    defaultLandingPage: string;
    notificationPrefs: Record<string, any>;
    createdAt: string;
    updatedAt: string;
}
export declare class WorkspacePreferencesResponseDto {
    id: string;
    workspaceId: string;
    preferences: Record<string, any>;
    createdAt: string;
    updatedAt: string;
}
export declare class WorkspaceMemberResponseDto {
    id: string;
    workspaceId: string;
    userId: string;
    createdAt: string;
}
