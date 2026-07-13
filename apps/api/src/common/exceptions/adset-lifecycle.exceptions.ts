import { BadRequestException } from '@nestjs/common';

export class AdSetNotPublishedException extends BadRequestException {
  constructor(adSetId: string) {
    super(`Ad Set with ID ${adSetId} is not published to Facebook.`);
  }
}

export class AdSetArchivedException extends BadRequestException {
  constructor(adSetId: string) {
    super(`Ad Set with ID ${adSetId} is archived and cannot be modified.`);
  }
}

export class AdSetAlreadyPausedException extends BadRequestException {
  constructor(adSetId: string) {
    super(`Ad Set with ID ${adSetId} is already paused.`);
  }
}

export class AdSetAlreadyActiveException extends BadRequestException {
  constructor(adSetId: string) {
    super(`Ad Set with ID ${adSetId} is already active.`);
  }
}

export class MetaOperationFailedException extends BadRequestException {
  constructor(message: string) {
    super(`Meta Graph API operation failed: ${message}`);
  }
}
