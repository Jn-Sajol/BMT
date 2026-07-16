import { BadRequestException, InternalServerErrorException } from '@nestjs/common';
export declare class AdSetAlreadyPublishedException extends BadRequestException {
    constructor(adSetId: string);
}
export declare class CampaignNotPublishedException extends BadRequestException {
    constructor(campaignId: string);
}
export declare class AdSetValidationException extends BadRequestException {
    constructor(message: string);
}
export declare class AdSetPublishException extends InternalServerErrorException {
    constructor(message: string, details?: any);
}
