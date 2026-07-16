import { Workspace, WorkspaceSettings, WorkspacePreferences, WorkspaceMember } from '@prisma/client';
import { WorkspaceResponseDto, WorkspaceSettingsResponseDto, WorkspacePreferencesResponseDto, WorkspaceMemberResponseDto } from '../dto/workspace-response.dto';
export declare class WorkspaceMapper {
    static toResponse(ws: Workspace): WorkspaceResponseDto;
    static toResponseList(wsList: Workspace[]): WorkspaceResponseDto[];
    static toSettingsResponse(settings: WorkspaceSettings): WorkspaceSettingsResponseDto;
    static toPreferencesResponse(prefs: WorkspacePreferences): WorkspacePreferencesResponseDto;
    static toMemberResponse(member: WorkspaceMember): WorkspaceMemberResponseDto;
    static toMemberResponseList(members: WorkspaceMember[]): WorkspaceMemberResponseDto[];
}
