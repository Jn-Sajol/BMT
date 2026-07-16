export interface IClockProvider {
    now(): Date;
    nowEpochMs(): number;
}
