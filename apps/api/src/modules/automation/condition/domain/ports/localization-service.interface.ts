export interface ILocalizationService {
  compareStrings(a: string, b: string, locale?: string, options?: Intl.CollatorOptions): number;
  getDayOfWeek(date: Date, locale?: string): string;
  formatDateTime(date: Date, format: string, timezone?: string, locale?: string): string;
}
