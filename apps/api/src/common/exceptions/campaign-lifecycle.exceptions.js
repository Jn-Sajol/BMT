"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CampaignAlreadyActiveException = exports.CampaignAlreadyPausedException = exports.MetaOperationFailedException = exports.CampaignArchivedException = exports.CampaignNotPublishedException = void 0;
const common_1 = require("@nestjs/common");
class CampaignNotPublishedException extends common_1.BadRequestException {
    constructor(campaignId) {
        super(`Campaign with ID ${campaignId} is not published to Facebook.`);
    }
}
exports.CampaignNotPublishedException = CampaignNotPublishedException;
class CampaignArchivedException extends common_1.BadRequestException {
    constructor(campaignId) {
        super(`Campaign with ID ${campaignId} is archived and cannot be modified.`);
    }
}
exports.CampaignArchivedException = CampaignArchivedException;
class MetaOperationFailedException extends common_1.BadRequestException {
    constructor(message) {
        super(`Meta Graph API operation failed: ${message}`);
    }
}
exports.MetaOperationFailedException = MetaOperationFailedException;
class CampaignAlreadyPausedException extends common_1.BadRequestException {
    constructor(campaignId) {
        super(`Campaign with ID ${campaignId} is already paused.`);
    }
}
exports.CampaignAlreadyPausedException = CampaignAlreadyPausedException;
class CampaignAlreadyActiveException extends common_1.BadRequestException {
    constructor(campaignId) {
        super(`Campaign with ID ${campaignId} is already active.`);
    }
}
exports.CampaignAlreadyActiveException = CampaignAlreadyActiveException;
//# sourceMappingURL=campaign-lifecycle.exceptions.js.map