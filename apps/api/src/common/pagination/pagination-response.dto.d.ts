export interface OffsetPaginatedResponse<T> {
    items: T[];
    total: number;
    limit: number;
    offset: number;
}
export interface CursorPaginatedResponse<T> {
    items: T[];
    nextCursor?: string;
    limit: number;
}
