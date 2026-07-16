"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MetaPublishException = exports.CampaignValidationException = exports.WorkspaceMismatchException = exports.MetaConnectionNotFoundException = exports.CampaignAlreadyPublishedException = void 0;
const common_1 = require("@nestjs/common");
class CampaignAlreadyPublishedException extends common_1.BadRequestException {
    constructor(campaignId) {
        super(`Campaign with ID ${campaignId} has already been published to Meta.`);
    }
}
exports.CampaignAlreadyPublishedException = CampaignAlreadyPublishedException;
class MetaConnectionNotFoundException extends common_1.NotFoundException {
    constructor(workspaceId) {
        super(`No active Meta Connection found for workspace ${workspaceId}.`);
    }
}
exports.MetaConnectionNotFoundException = MetaConnectionNotFoundException;
class WorkspaceMismatchException extends common_1.BadRequestException {
    constructor() {
        super(`Campaign workspace context does not match active request workspace context.`);
    }
}
exports.WorkspaceMismatchException = WorkspaceMismatchException;
class CampaignValidationException extends common_1.BadRequestException {
    constructor(message) {
        super(`Campaign validation failed: ${message}`);
    }
}
exports.CampaignValidationException = CampaignValidationException;
class MetaPublishException extends common_1.InternalServerErrorException {
    constructor(message, details) {
        super({
            message: `Failed to publish campaign to Meta: ${message}`,
            details,
        });
    }
}
exports.MetaPublishException = MetaPublishException;
//# sourceMappingURL=campaign-publish.exceptions.js.map