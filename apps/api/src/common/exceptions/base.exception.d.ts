import { ErrorCode } from './error-codes';
export declare class BaseException extends Error {
    readonly message: string;
    readonly code: ErrorCode;
    readonly status: number;
    readonly details: string[];
    constructor(message: string, code?: ErrorCode, status?: number, details?: string[]);
}
