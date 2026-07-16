"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseException = void 0;
const common_1 = require("@nestjs/common");
const error_codes_1 = require("./error-codes");
class BaseException extends Error {
    message;
    code;
    status;
    details;
    constructor(message, code = error_codes_1.ErrorCode.INTERNAL_SERVER_ERROR, status = common_1.HttpStatus.INTERNAL_SERVER_ERROR, details = []) {
        super(message);
        this.message = message;
        this.code = code;
        this.status = status;
        this.details = details;
        Object.setPrototypeOf(this, new.target.prototype);
    }
}
exports.BaseException = BaseException;
//# sourceMappingURL=base.exception.js.map