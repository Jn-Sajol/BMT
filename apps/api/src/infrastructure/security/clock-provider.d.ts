import { IClockProvider } from '../../common/ports/clock-provider.interface';
export declare class ClockProvider implements IClockProvider {
    now(): Date;
    nowEpochMs(): number;
}
