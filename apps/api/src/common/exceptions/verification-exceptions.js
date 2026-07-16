"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VerificationUserNotFoundException = exports.ExpiredTokenException = exports.InvalidTokenException = exports.AlreadyVerifiedException = void 0;
const common_1 = require("@nestjs/common");
const base_exception_1 = require("./base.exception");
const error_codes_1 = require("./error-codes");
class AlreadyVerifiedException extends base_exception_1.BaseException {
    constructor(email) {
        super(`Email '${email}' is already verified`, error_codes_1.ErrorCode.CONFLICT, common_1.HttpStatus.CONFLICT);
    }
}
exports.AlreadyVerifiedException = AlreadyVerifiedException;
class InvalidTokenException extends base_exception_1.BaseException {
    constructor() {
        super(`Verification token is invalid`, error_codes_1.ErrorCode.BAD_REQUEST, common_1.HttpStatus.BAD_REQUEST);
    }
}
exports.InvalidTokenException = InvalidTokenException;
class ExpiredTokenException extends base_exception_1.BaseException {
    constructor() {
        super(`Verification token has expired`, error_codes_1.ErrorCode.BAD_REQUEST, common_1.HttpStatus.BAD_REQUEST);
    }
}
exports.ExpiredTokenException = ExpiredTokenException;
class VerificationUserNotFoundException extends base_exception_1.BaseException {
    constructor(userId) {
        super(`User associated with verification request '${userId}' was not found`, error_codes_1.ErrorCode.NOT_FOUND, common_1.HttpStatus.NOT_FOUND);
    }
}
exports.VerificationUserNotFoundException = VerificationUserNotFoundException;
//# sourceMappingURL=verification-exceptions.js.map