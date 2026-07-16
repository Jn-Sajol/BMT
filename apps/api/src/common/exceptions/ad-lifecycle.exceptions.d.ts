import { BadRequestException } from '@nestjs/common';
export declare class AdNotPublishedException extends BadRequestException {
    constructor(adId: string);
}
export declare class AdArchivedException extends BadRequestException {
    constructor(adId: string);
}
export declare class AdAlreadyPausedException extends BadRequestException {
    constructor(adId: string);
}
export declare class AdAlreadyActiveException extends BadRequestException {
    constructor(adId: string);
}
export declare class AdRecreationRequiredException extends BadRequestException {
    constructor(adId: string);
}
export declare class MetaOperationFailedException extends BadRequestException {
    constructor(message: string);
}
