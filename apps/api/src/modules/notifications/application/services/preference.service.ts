import { Injectable } from "@nestjs/common"
import { NotificationPreference } from "../../domain/preference.model"

@Injectable()
export class PreferenceService {
  private preferences = new Map<string, NotificationPreference>()

  public getPreferences(userId: string, workspaceId: string): NotificationPreference {
    const key = `${userId}:${workspaceId}`
    const existing = this.preferences.get(key)
    if (existing) return existing

    // Return default preferences
    return {
      userId,
      workspaceId,
      channels: { inApp: true, email: true, slack: false, webhook: false },
      events: { workflowFailed: true, workflowApproved: true, mention: true, aiSuggestion: false, reviewRequest: true },
    }
  }

  public savePreferences(userId: string, workspaceId: string, prefs: NotificationPreference): NotificationPreference {
    const key = `${userId}:${workspaceId}`
    this.preferences.set(key, prefs)
    return prefs
  }
}
