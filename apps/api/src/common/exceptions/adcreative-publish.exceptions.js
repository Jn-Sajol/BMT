"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenExpiredException = exports.FacebookPublishException = exports.ParentAdSetNotPublishedException = exports.ParentCampaignNotPublishedException = exports.CreativeValidationException = exports.CreativeAlreadyPublishedException = void 0;
const common_1 = require("@nestjs/common");
class CreativeAlreadyPublishedException extends common_1.BadRequestException {
    constructor(creativeId) {
        super(`Ad Creative with ID ${creativeId} has already been published to Meta.`);
    }
}
exports.CreativeAlreadyPublishedException = CreativeAlreadyPublishedException;
class CreativeValidationException extends common_1.BadRequestException {
    constructor(message) {
        super(`Ad Creative validation failed: ${message}`);
    }
}
exports.CreativeValidationException = CreativeValidationException;
class ParentCampaignNotPublishedException extends common_1.BadRequestException {
    constructor(campaignId) {
        super(`Parent Campaign with ID ${campaignId} must be published to Meta before publishing Ad Creative.`);
    }
}
exports.ParentCampaignNotPublishedException = ParentCampaignNotPublishedException;
class ParentAdSetNotPublishedException extends common_1.BadRequestException {
    constructor(adSetId) {
        super(`Parent Ad Set with ID ${adSetId} must be published to Meta before publishing Ad Creative.`);
    }
}
exports.ParentAdSetNotPublishedException = ParentAdSetNotPublishedException;
class FacebookPublishException extends common_1.InternalServerErrorException {
    constructor(message, details) {
        super({
            message: `Meta Graph API Creative publish failed: ${message}`,
            details,
        });
    }
}
exports.FacebookPublishException = FacebookPublishException;
class TokenExpiredException extends common_1.BadRequestException {
    constructor() {
        super('Meta access token has expired or is invalid. Please reconnect your account.');
    }
}
exports.TokenExpiredException = TokenExpiredException;
//# sourceMappingURL=adcreative-publish.exceptions.js.map