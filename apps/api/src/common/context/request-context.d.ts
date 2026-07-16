export interface RequestContextStore {
    correlationId: string;
    tenantId?: string;
    userId?: string;
}
export declare class RequestContext {
    private static storage;
    static run(store: RequestContextStore, callback: () => any): any;
    static get current(): RequestContextStore | undefined;
    static get correlationId(): string | undefined;
    static get tenantId(): string | undefined;
    static get userId(): string | undefined;
}
