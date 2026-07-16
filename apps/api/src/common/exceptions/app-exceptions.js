"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LimitExceededException = exports.ValidationException = exports.ConflictException = exports.ForbiddenException = exports.UnauthorizedException = exports.BadRequestException = exports.NotFoundException = void 0;
const common_1 = require("@nestjs/common");
const base_exception_1 = require("./base.exception");
const error_codes_1 = require("./error-codes");
class NotFoundException extends base_exception_1.BaseException {
    constructor(message = 'Resource not found', details = []) {
        super(message, error_codes_1.ErrorCode.NOT_FOUND, common_1.HttpStatus.NOT_FOUND, details);
    }
}
exports.NotFoundException = NotFoundException;
class BadRequestException extends base_exception_1.BaseException {
    constructor(message = 'Bad request', details = []) {
        super(message, error_codes_1.ErrorCode.BAD_REQUEST, common_1.HttpStatus.BAD_REQUEST, details);
    }
}
exports.BadRequestException = BadRequestException;
class UnauthorizedException extends base_exception_1.BaseException {
    constructor(message = 'Unauthorized access', details = []) {
        super(message, error_codes_1.ErrorCode.UNAUTHORIZED, common_1.HttpStatus.UNAUTHORIZED, details);
    }
}
exports.UnauthorizedException = UnauthorizedException;
class ForbiddenException extends base_exception_1.BaseException {
    constructor(message = 'Access forbidden', details = []) {
        super(message, error_codes_1.ErrorCode.FORBIDDEN, common_1.HttpStatus.FORBIDDEN, details);
    }
}
exports.ForbiddenException = ForbiddenException;
class ConflictException extends base_exception_1.BaseException {
    constructor(message = 'Conflict detected', details = []) {
        super(message, error_codes_1.ErrorCode.CONFLICT, common_1.HttpStatus.CONFLICT, details);
    }
}
exports.ConflictException = ConflictException;
class ValidationException extends base_exception_1.BaseException {
    constructor(details = [], message = 'Validation failed') {
        super(message, error_codes_1.ErrorCode.VALIDATION_ERROR, common_1.HttpStatus.BAD_REQUEST, details);
    }
}
exports.ValidationException = ValidationException;
class LimitExceededException extends base_exception_1.BaseException {
    constructor(message = 'Action limit exceeded', details = []) {
        super(message, error_codes_1.ErrorCode.LIMIT_EXCEEDED, common_1.HttpStatus.TOO_MANY_REQUESTS, details);
    }
}
exports.LimitExceededException = LimitExceededException;
//# sourceMappingURL=app-exceptions.js.map