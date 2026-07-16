import { BadRequestException } from '@nestjs/common';
export declare class AdSetNotPublishedException extends BadRequestException {
    constructor(adSetId: string);
}
export declare class AdSetArchivedException extends BadRequestException {
    constructor(adSetId: string);
}
export declare class AdSetAlreadyPausedException extends BadRequestException {
    constructor(adSetId: string);
}
export declare class AdSetAlreadyActiveException extends BadRequestException {
    constructor(adSetId: string);
}
export declare class MetaOperationFailedException extends BadRequestException {
    constructor(message: string);
}
