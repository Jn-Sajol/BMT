import { AsyncLocalStorage } from 'async_hooks';

export interface RequestContextStore {
  correlationId: string;
  tenantId?: string;
  userId?: string;
}

export class RequestContext {
  private static storage = new AsyncLocalStorage<RequestContextStore>();

  static run(store: RequestContextStore, callback: () => any): any {
    return this.storage.run(store, callback);
  }

  static get current(): RequestContextStore | undefined {
    return this.storage.getStore();
  }

  static get correlationId(): string | undefined {
    return this.current?.correlationId;
  }

  static get tenantId(): string | undefined {
    return this.current?.tenantId;
  }

  static get userId(): string | undefined {
    return this.current?.userId;
  }
}
