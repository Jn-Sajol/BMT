"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SessionInvalidException = exports.SessionExpiredException = void 0;
const common_1 = require("@nestjs/common");
const base_exception_1 = require("./base.exception");
const error_codes_1 = require("./error-codes");
class SessionExpiredException extends base_exception_1.BaseException {
    constructor() {
        super(`Session has expired`, error_codes_1.ErrorCode.UNAUTHORIZED, common_1.HttpStatus.UNAUTHORIZED);
    }
}
exports.SessionExpiredException = SessionExpiredException;
class SessionInvalidException extends base_exception_1.BaseException {
    constructor() {
        super(`Session is invalid`, error_codes_1.ErrorCode.UNAUTHORIZED, common_1.HttpStatus.UNAUTHORIZED);
    }
}
exports.SessionInvalidException = SessionInvalidException;
//# sourceMappingURL=session-exceptions.js.map