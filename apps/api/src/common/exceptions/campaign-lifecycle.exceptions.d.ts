import { BadRequestException } from '@nestjs/common';
export declare class CampaignNotPublishedException extends BadRequestException {
    constructor(campaignId: string);
}
export declare class CampaignArchivedException extends BadRequestException {
    constructor(campaignId: string);
}
export declare class MetaOperationFailedException extends BadRequestException {
    constructor(message: string);
}
export declare class CampaignAlreadyPausedException extends BadRequestException {
    constructor(campaignId: string);
}
export declare class CampaignAlreadyActiveException extends BadRequestException {
    constructor(campaignId: string);
}
