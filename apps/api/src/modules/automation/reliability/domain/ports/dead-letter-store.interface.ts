export interface IDeadLetterStore {
  storeDeadLetter(
    workspaceId: string,
    provider: string,
    eventName: string,
    payload: any,
    correlationId: string,
    causationId: string,
    reason: string,
    retryCount: number,
  ): Promise<string>;
  replayDeadLetter(id: string): Promise<void>;
}
