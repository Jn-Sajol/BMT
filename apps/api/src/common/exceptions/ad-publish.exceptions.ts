import { BadRequestException, InternalServerErrorException } from '@nestjs/common';

export class AdAlreadyPublishedException extends BadRequestException {
  constructor(adId: string) {
    super(`Ad with ID ${adId} has already been published to Meta.`);
  }
}

export class ParentCampaignNotPublishedException extends BadRequestException {
  constructor(campaignId: string) {
    super(`Parent Campaign with ID ${campaignId} must be published to Meta before publishing Ad.`);
  }
}

export class ParentAdSetNotPublishedException extends BadRequestException {
  constructor(adSetId: string) {
    super(`Parent Ad Set with ID ${adSetId} must be published to Meta before publishing Ad.`);
  }
}

export class CreativeNotPublishedException extends BadRequestException {
  constructor(creativeId: string) {
    super(`Ad Creative with ID ${creativeId} must be published to Meta before publishing Ad.`);
  }
}

export class AdPublishValidationException extends BadRequestException {
  constructor(message: string) {
    super(`Ad publish validation failed: ${message}`);
  }
}

export class FacebookAdPublishException extends InternalServerErrorException {
  constructor(message: string, details?: any) {
    super({
      message: `Meta Graph API Ad publish failed: ${message}`,
      details,
    });
  }
}
