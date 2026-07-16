import { BadRequestException, InternalServerErrorException } from '@nestjs/common';
export declare class AdAlreadyPublishedException extends BadRequestException {
    constructor(adId: string);
}
export declare class ParentCampaignNotPublishedException extends BadRequestException {
    constructor(campaignId: string);
}
export declare class ParentAdSetNotPublishedException extends BadRequestException {
    constructor(adSetId: string);
}
export declare class CreativeNotPublishedException extends BadRequestException {
    constructor(creativeId: string);
}
export declare class AdPublishValidationException extends BadRequestException {
    constructor(message: string);
}
export declare class FacebookAdPublishException extends InternalServerErrorException {
    constructor(message: string, details?: any);
}
