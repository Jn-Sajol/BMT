"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MetaOperationFailedException = exports.AdSetAlreadyActiveException = exports.AdSetAlreadyPausedException = exports.AdSetArchivedException = exports.AdSetNotPublishedException = void 0;
const common_1 = require("@nestjs/common");
class AdSetNotPublishedException extends common_1.BadRequestException {
    constructor(adSetId) {
        super(`Ad Set with ID ${adSetId} is not published to Facebook.`);
    }
}
exports.AdSetNotPublishedException = AdSetNotPublishedException;
class AdSetArchivedException extends common_1.BadRequestException {
    constructor(adSetId) {
        super(`Ad Set with ID ${adSetId} is archived and cannot be modified.`);
    }
}
exports.AdSetArchivedException = AdSetArchivedException;
class AdSetAlreadyPausedException extends common_1.BadRequestException {
    constructor(adSetId) {
        super(`Ad Set with ID ${adSetId} is already paused.`);
    }
}
exports.AdSetAlreadyPausedException = AdSetAlreadyPausedException;
class AdSetAlreadyActiveException extends common_1.BadRequestException {
    constructor(adSetId) {
        super(`Ad Set with ID ${adSetId} is already active.`);
    }
}
exports.AdSetAlreadyActiveException = AdSetAlreadyActiveException;
class MetaOperationFailedException extends common_1.BadRequestException {
    constructor(message) {
        super(`Meta Graph API operation failed: ${message}`);
    }
}
exports.MetaOperationFailedException = MetaOperationFailedException;
//# sourceMappingURL=adset-lifecycle.exceptions.js.map