import { BadRequestException, InternalServerErrorException } from '@nestjs/common';
export declare class CreativeAlreadyPublishedException extends BadRequestException {
    constructor(creativeId: string);
}
export declare class CreativeValidationException extends BadRequestException {
    constructor(message: string);
}
export declare class ParentCampaignNotPublishedException extends BadRequestException {
    constructor(campaignId: string);
}
export declare class ParentAdSetNotPublishedException extends BadRequestException {
    constructor(adSetId: string);
}
export declare class FacebookPublishException extends InternalServerErrorException {
    constructor(message: string, details?: any);
}
export declare class TokenExpiredException extends BadRequestException {
    constructor();
}
