export interface INotificationPreferenceStore {
  isChannelAllowed(workspaceId: string, userId: string, channel: string, severity: string): Promise<boolean>;
  getQuietHours(workspaceId: string, userId: string): Promise<{ startHour: number; endHour: number; enabled: boolean } | null>;
}
