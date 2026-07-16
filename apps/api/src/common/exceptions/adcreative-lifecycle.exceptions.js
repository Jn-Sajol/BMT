"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MetaOperationFailedException = exports.AdCreativeRecreationRequiredException = exports.AdCreativeImmutableException = exports.AdCreativeNotPublishedException = void 0;
const common_1 = require("@nestjs/common");
class AdCreativeNotPublishedException extends common_1.BadRequestException {
    constructor(creativeId) {
        super(`Ad Creative with ID ${creativeId} is not published to Facebook.`);
    }
}
exports.AdCreativeNotPublishedException = AdCreativeNotPublishedException;
class AdCreativeImmutableException extends common_1.BadRequestException {
    constructor(attribute) {
        super(`Ad Creative attribute "${attribute}" is immutable after publication on Meta Graph API.`);
    }
}
exports.AdCreativeImmutableException = AdCreativeImmutableException;
class AdCreativeRecreationRequiredException extends common_1.BadRequestException {
    constructor(creativeId) {
        super(`Ad Creative with ID ${creativeId} requires recreation to apply requested modifications.`);
    }
}
exports.AdCreativeRecreationRequiredException = AdCreativeRecreationRequiredException;
class MetaOperationFailedException extends common_1.BadRequestException {
    constructor(message) {
        super(`Meta Graph API operation failed: ${message}`);
    }
}
exports.MetaOperationFailedException = MetaOperationFailedException;
//# sourceMappingURL=adcreative-lifecycle.exceptions.js.map