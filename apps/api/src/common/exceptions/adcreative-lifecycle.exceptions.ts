import { BadRequestException } from '@nestjs/common';

export class AdCreativeNotPublishedException extends BadRequestException {
  constructor(creativeId: string) {
    super(`Ad Creative with ID ${creativeId} is not published to Facebook.`);
  }
}

export class AdCreativeImmutableException extends BadRequestException {
  constructor(attribute: string) {
    super(`Ad Creative attribute "${attribute}" is immutable after publication on Meta Graph API.`);
  }
}

export class AdCreativeRecreationRequiredException extends BadRequestException {
  constructor(creativeId: string) {
    super(`Ad Creative with ID ${creativeId} requires recreation to apply requested modifications.`);
  }
}

export class MetaOperationFailedException extends BadRequestException {
  constructor(message: string) {
    super(`Meta Graph API operation failed: ${message}`);
  }
}
