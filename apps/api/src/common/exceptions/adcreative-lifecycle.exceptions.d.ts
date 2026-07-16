import { BadRequestException } from '@nestjs/common';
export declare class AdCreativeNotPublishedException extends BadRequestException {
    constructor(creativeId: string);
}
export declare class AdCreativeImmutableException extends BadRequestException {
    constructor(attribute: string);
}
export declare class AdCreativeRecreationRequiredException extends BadRequestException {
    constructor(creativeId: string);
}
export declare class MetaOperationFailedException extends BadRequestException {
    constructor(message: string);
}
