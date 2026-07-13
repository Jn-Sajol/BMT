export interface ISchedulerEngine {
  triggerSchedule(scheduleId: string, workspaceId: string): Promise<void>;
  pauseSchedule(scheduleId: string): Promise<void>;
  resumeSchedule(scheduleId: string): Promise<void>;
}
