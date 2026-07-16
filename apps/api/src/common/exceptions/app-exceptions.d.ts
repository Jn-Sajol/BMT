import { BaseException } from './base.exception';
export declare class NotFoundException extends BaseException {
    constructor(message?: string, details?: string[]);
}
export declare class BadRequestException extends BaseException {
    constructor(message?: string, details?: string[]);
}
export declare class UnauthorizedException extends BaseException {
    constructor(message?: string, details?: string[]);
}
export declare class ForbiddenException extends BaseException {
    constructor(message?: string, details?: string[]);
}
export declare class ConflictException extends BaseException {
    constructor(message?: string, details?: string[]);
}
export declare class ValidationException extends BaseException {
    constructor(details?: string[], message?: string);
}
export declare class LimitExceededException extends BaseException {
    constructor(message?: string, details?: string[]);
}
