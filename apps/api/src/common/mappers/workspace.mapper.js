"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkspaceMapper = void 0;
class WorkspaceMapper {
    static toResponse(ws) {
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
    static toResponseList(wsList) {
        return wsList.map(ws => this.toResponse(ws));
    }
    static toSettingsResponse(settings) {
        return {
            id: settings.id,
            workspaceId: settings.workspaceId,
            timezone: settings.timezone,
            language: settings.language,
            dateFormat: settings.dateFormat,
            timeFormat: settings.timeFormat,
            theme: settings.theme,
            defaultLandingPage: settings.defaultLandingPage,
            notificationPrefs: settings.notificationPrefs,
            createdAt: settings.createdAt.toISOString(),
            updatedAt: settings.updatedAt.toISOString(),
        };
    }
    static toPreferencesResponse(prefs) {
        return {
            id: prefs.id,
            workspaceId: prefs.workspaceId,
            preferences: prefs.preferences,
            createdAt: prefs.createdAt.toISOString(),
            updatedAt: prefs.updatedAt.toISOString(),
        };
    }
    static toMemberResponse(member) {
        return {
            id: member.id,
            workspaceId: member.workspaceId,
            userId: member.userId,
            createdAt: member.createdAt.toISOString(),
        };
    }
    static toMemberResponseList(members) {
        return members.map(m => this.toMemberResponse(m));
    }
}
exports.WorkspaceMapper = WorkspaceMapper;
//# sourceMappingURL=workspace.mapper.js.map