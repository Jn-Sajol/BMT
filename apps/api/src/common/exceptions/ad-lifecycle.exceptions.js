"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MetaOperationFailedException = exports.AdRecreationRequiredException = exports.AdAlreadyActiveException = exports.AdAlreadyPausedException = exports.AdArchivedException = exports.AdNotPublishedException = void 0;
const common_1 = require("@nestjs/common");
class AdNotPublishedException extends common_1.BadRequestException {
    constructor(adId) {
        super(`Ad with ID ${adId} is not published to Facebook.`);
    }
}
exports.AdNotPublishedException = AdNotPublishedException;
class AdArchivedException extends common_1.BadRequestException {
    constructor(adId) {
        super(`Ad with ID ${adId} is archived and cannot be modified.`);
    }
}
exports.AdArchivedException = AdArchivedException;
class AdAlreadyPausedException extends common_1.BadRequestException {
    constructor(adId) {
        super(`Ad with ID ${adId} is already paused.`);
    }
}
exports.AdAlreadyPausedException = AdAlreadyPausedException;
class AdAlreadyActiveException extends common_1.BadRequestException {
    constructor(adId) {
        super(`Ad with ID ${adId} is already active.`);
    }
}
exports.AdAlreadyActiveException = AdAlreadyActiveException;
class AdRecreationRequiredException extends common_1.BadRequestException {
    constructor(adId) {
        super(`Ad with ID ${adId} requires recreation to apply requested modifications.`);
    }
}
exports.AdRecreationRequiredException = AdRecreationRequiredException;
class MetaOperationFailedException extends common_1.BadRequestException {
    constructor(message) {
        super(`Meta Graph API operation failed: ${message}`);
    }
}
exports.MetaOperationFailedException = MetaOperationFailedException;
//# sourceMappingURL=ad-lifecycle.exceptions.js.map