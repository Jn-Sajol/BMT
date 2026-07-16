import { ITimezoneConverter } from '../../domain/ports/timezone-converter.interface';
export declare class TimezoneConversionService implements ITimezoneConverter {
    calculateNextRun(cronExpression: string, timezone: string, baseDate: Date): Date;
}
