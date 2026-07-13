import { Injectable } from '@nestjs/common';
import { AsyncLocalStorage } from 'async_hooks';

export interface RequestContextStore {
  correlationId: string;
  workspaceId?: string;
  userId?: string;
  requestId?: string;
}

@Injectable()
export class CorrelationService {
  private static readonly asyncLocalStorage = new AsyncLocalStorage<RequestContextStore>();

  runWithContext(store: RequestContextStore, callback: () => any) {
    return CorrelationService.asyncLocalStorage.run(store, callback);
  }

  getStore(): RequestContextStore | undefined {
    return CorrelationService.asyncLocalStorage.getStore();
  }

  getCorrelationId(): string {
    return this.getStore()?.correlationId || 'system-global';
  }

  getWorkspaceId(): string | undefined {
    return this.getStore()?.workspaceId;
  }

  getUserId(): string | undefined {
    return this.getStore()?.userId;
  }

  getRequestId(): string | undefined {
    return this.getStore()?.requestId;
  }
}
