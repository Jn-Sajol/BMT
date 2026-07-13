import { Injectable } from '@nestjs/common';
import { ILocalizationService } from '../../domain/ports/localization-service.interface';

@Injectable()
export class LocalizationService implements ILocalizationService {
  compareStrings(a: string, b: string, locale = 'en-US', options?: Intl.CollatorOptions): number {
    return new Intl.Collator(locale, options).compare(a, b);
  }

  getDayOfWeek(date: Date, locale = 'en-US'): string {
    return new Intl.DateTimeFormat(locale, { weekday: 'long' }).format(date);
  }

  formatDateTime(date: Date, format: string, timezone = 'UTC', locale = 'en-US'): string {
    return new Intl.DateTimeFormat(locale, {
      timeZone: timezone,
      dateStyle: 'short',
      timeStyle: 'medium',
    }).format(date);
  }
}
