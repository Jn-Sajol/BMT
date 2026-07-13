import { Workspace, WorkspaceSettings, WorkspacePreferences, WorkspaceMember } from '@prisma/client';
import { 
  WorkspaceResponseDto, 
  WorkspaceSettingsResponseDto, 
  WorkspacePreferencesResponseDto, 
  WorkspaceMemberResponseDto 
} from '../dto/workspace-response.dto';

export class WorkspaceMapper {
  static toResponse(ws: Workspace): WorkspaceResponseDto {
    return {
      id: ws.id,
      organizationId: ws.organizationId,
      name: ws.name,
      slug: ws.slug,
      description: ws.description,
      workspaceType: ws.workspaceType,
      visibility: ws.visibility,
      status: ws.status,
      createdAt: ws.createdAt.toISOString(),
      updatedAt: ws.updatedAt.toISOString(),
    };
  }

  static toResponseList(wsList: Workspace[]): WorkspaceResponseDto[] {
    return wsList.map(ws => this.toResponse(ws));
  }

  static toSettingsResponse(settings: WorkspaceSettings): WorkspaceSettingsResponseDto {
    return {
      id: settings.id,
      workspaceId: settings.workspaceId,
      timezone: settings.timezone,
      language: settings.language,
      dateFormat: settings.dateFormat,
      timeFormat: settings.timeFormat,
      theme: settings.theme,
      defaultLandingPage: settings.defaultLandingPage,
      notificationPrefs: settings.notificationPrefs as Record<string, any>,
      createdAt: settings.createdAt.toISOString(),
      updatedAt: settings.updatedAt.toISOString(),
    };
  }

  static toPreferencesResponse(prefs: WorkspacePreferences): WorkspacePreferencesResponseDto {
    return {
      id: prefs.id,
      workspaceId: prefs.workspaceId,
      preferences: prefs.preferences as Record<string, any>,
      createdAt: prefs.createdAt.toISOString(),
      updatedAt: prefs.updatedAt.toISOString(),
    };
  }

  static toMemberResponse(member: WorkspaceMember): WorkspaceMemberResponseDto {
    return {
      id: member.id,
      workspaceId: member.workspaceId,
      userId: member.userId,
      createdAt: member.createdAt.toISOString(),
    };
  }

  static toMemberResponseList(members: WorkspaceMember[]): WorkspaceMemberResponseDto[] {
    return members.map(m => this.toMemberResponse(m));
  }
}
