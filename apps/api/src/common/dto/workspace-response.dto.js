"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkspaceMemberResponseDto = exports.WorkspacePreferencesResponseDto = exports.WorkspaceSettingsResponseDto = exports.WorkspaceResponseDto = void 0;
class WorkspaceResponseDto {
    id;
    organizationId;
    name;
    slug;
    description;
    workspaceType;
    visibility;
    status;
    createdAt;
    updatedAt;
}
exports.WorkspaceResponseDto = WorkspaceResponseDto;
class WorkspaceSettingsResponseDto {
    id;
    workspaceId;
    timezone;
    language;
    dateFormat;
    timeFormat;
    theme;
    defaultLandingPage;
    notificationPrefs;
    createdAt;
    updatedAt;
}
exports.WorkspaceSettingsResponseDto = WorkspaceSettingsResponseDto;
class WorkspacePreferencesResponseDto {
    id;
    workspaceId;
    preferences;
    createdAt;
    updatedAt;
}
exports.WorkspacePreferencesResponseDto = WorkspacePreferencesResponseDto;
class WorkspaceMemberResponseDto {
    id;
    workspaceId;
    userId;
    createdAt;
}
exports.WorkspaceMemberResponseDto = WorkspaceMemberResponseDto;
//# sourceMappingURL=workspace-response.dto.js.map