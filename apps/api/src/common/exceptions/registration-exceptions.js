"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvalidEmailException = exports.InvalidPasswordException = void 0;
const common_1 = require("@nestjs/common");
const base_exception_1 = require("./base.exception");
const error_codes_1 = require("./error-codes");
class InvalidPasswordException extends base_exception_1.BaseException {
    constructor(message = 'Password does not meet complexity requirements') {
        super(message, error_codes_1.ErrorCode.VALIDATION_ERROR, common_1.HttpStatus.BAD_REQUEST);
    }
}
exports.InvalidPasswordException = InvalidPasswordException;
class InvalidEmailException extends base_exception_1.BaseException {
    constructor(message = 'Email address is not in a valid format') {
        super(message, error_codes_1.ErrorCode.VALIDATION_ERROR, common_1.HttpStatus.BAD_REQUEST);
    }
}
exports.InvalidEmailException = InvalidEmailException;
//# sourceMappingURL=registration-exceptions.js.map