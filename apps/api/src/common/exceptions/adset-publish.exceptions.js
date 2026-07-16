"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdSetPublishException = exports.AdSetValidationException = exports.CampaignNotPublishedException = exports.AdSetAlreadyPublishedException = void 0;
const common_1 = require("@nestjs/common");
class AdSetAlreadyPublishedException extends common_1.BadRequestException {
    constructor(adSetId) {
        super(`Ad Set with ID ${adSetId} has already been published to Meta.`);
    }
}
exports.AdSetAlreadyPublishedException = AdSetAlreadyPublishedException;
class CampaignNotPublishedException extends common_1.BadRequestException {
    constructor(campaignId) {
        super(`Parent Campaign with ID ${campaignId} must be published to Meta before publishing Ad Set.`);
    }
}
exports.CampaignNotPublishedException = CampaignNotPublishedException;
class AdSetValidationException extends common_1.BadRequestException {
    constructor(message) {
        super(`Ad Set validation failed: ${message}`);
    }
}
exports.AdSetValidationException = AdSetValidationException;
class AdSetPublishException extends common_1.InternalServerErrorException {
    constructor(message, details) {
        super({
            message: `Failed to publish Ad Set to Meta: ${message}`,
            details,
        });
    }
}
exports.AdSetPublishException = AdSetPublishException;
//# sourceMappingURL=adset-publish.exceptions.js.map