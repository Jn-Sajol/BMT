import { Injectable } from '@nestjs/common';
import { IClockProvider } from '../../common/ports/clock-provider.interface';

@Injectable()
export class ClockProvider implements IClockProvider {
  now(): Date {
    return new Date();
  }

  nowEpochMs(): number {
    return Date.now();
  }
}
