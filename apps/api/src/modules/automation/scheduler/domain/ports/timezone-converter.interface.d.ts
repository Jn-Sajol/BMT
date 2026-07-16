export interface ITimezoneConverter {
    calculateNextRun(cronExpression: string, timezone: string, baseDate: Date): Date;
}
