import { BaseException } from './base.exception';
export declare class InvalidPasswordException extends BaseException {
    constructor(message?: string);
}
export declare class InvalidEmailException extends BaseException {
    constructor(message?: string);
}
