"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FacebookAdPublishException = exports.AdPublishValidationException = exports.CreativeNotPublishedException = exports.ParentAdSetNotPublishedException = exports.ParentCampaignNotPublishedException = exports.AdAlreadyPublishedException = void 0;
const common_1 = require("@nestjs/common");
class AdAlreadyPublishedException extends common_1.BadRequestException {
    constructor(adId) {
        super(`Ad with ID ${adId} has already been published to Meta.`);
    }
}
exports.AdAlreadyPublishedException = AdAlreadyPublishedException;
class ParentCampaignNotPublishedException extends common_1.BadRequestException {
    constructor(campaignId) {
        super(`Parent Campaign with ID ${campaignId} must be published to Meta before publishing Ad.`);
    }
}
exports.ParentCampaignNotPublishedException = ParentCampaignNotPublishedException;
class ParentAdSetNotPublishedException extends common_1.BadRequestException {
    constructor(adSetId) {
        super(`Parent Ad Set with ID ${adSetId} must be published to Meta before publishing Ad.`);
    }
}
exports.ParentAdSetNotPublishedException = ParentAdSetNotPublishedException;
class CreativeNotPublishedException extends common_1.BadRequestException {
    constructor(creativeId) {
        super(`Ad Creative with ID ${creativeId} must be published to Meta before publishing Ad.`);
    }
}
exports.CreativeNotPublishedException = CreativeNotPublishedException;
class AdPublishValidationException extends common_1.BadRequestException {
    constructor(message) {
        super(`Ad publish validation failed: ${message}`);
    }
}
exports.AdPublishValidationException = AdPublishValidationException;
class FacebookAdPublishException extends common_1.InternalServerErrorException {
    constructor(message, details) {
        super({
            message: `Meta Graph API Ad publish failed: ${message}`,
            details,
        });
    }
}
exports.FacebookAdPublishException = FacebookAdPublishException;
//# sourceMappingURL=ad-publish.exceptions.js.map