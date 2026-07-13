import { BadRequestException } from '@nestjs/common';

export class AdNotPublishedException extends BadRequestException {
  constructor(adId: string) {
    super(`Ad with ID ${adId} is not published to Facebook.`);
  }
}

export class AdArchivedException extends BadRequestException {
  constructor(adId: string) {
    super(`Ad with ID ${adId} is archived and cannot be modified.`);
  }
}

export class AdAlreadyPausedException extends BadRequestException {
  constructor(adId: string) {
    super(`Ad with ID ${adId} is already paused.`);
  }
}

export class AdAlreadyActiveException extends BadRequestException {
  constructor(adId: string) {
    super(`Ad with ID ${adId} is already active.`);
  }
}

export class AdRecreationRequiredException extends BadRequestException {
  constructor(adId: string) {
    super(`Ad with ID ${adId} requires recreation to apply requested modifications.`);
  }
}

export class MetaOperationFailedException extends BadRequestException {
  constructor(message: string) {
    super(`Meta Graph API operation failed: ${message}`);
  }
}
