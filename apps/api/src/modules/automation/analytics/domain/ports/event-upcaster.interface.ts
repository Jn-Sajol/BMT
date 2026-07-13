export interface IEventUpcaster {
  provider: string;
  targetEventName: string;
  sourceVersion: string;
  targetVersion: string;
  upcast(event: any): any;
}
