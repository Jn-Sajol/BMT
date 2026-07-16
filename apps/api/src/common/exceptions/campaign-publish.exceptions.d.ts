import { BadRequestException, NotFoundException, InternalServerErrorException } from '@nestjs/common';
export declare class CampaignAlreadyPublishedException extends BadRequestException {
    constructor(campaignId: string);
}
export declare class MetaConnectionNotFoundException extends NotFoundException {
    constructor(workspaceId: string);
}
export declare class WorkspaceMismatchException extends BadRequestException {
    constructor();
}
export declare class CampaignValidationException extends BadRequestException {
    constructor(message: string);
}
export declare class MetaPublishException extends InternalServerErrorException {
    constructor(message: string, details?: any);
}
