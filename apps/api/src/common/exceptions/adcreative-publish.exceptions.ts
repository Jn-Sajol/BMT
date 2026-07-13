import { BadRequestException, InternalServerErrorException } from '@nestjs/common';

export class CreativeAlreadyPublishedException extends BadRequestException {
  constructor(creativeId: string) {
    super(`Ad Creative with ID ${creativeId} has already been published to Meta.`);
  }
}

export class CreativeValidationException extends BadRequestException {
  constructor(message: string) {
    super(`Ad Creative validation failed: ${message}`);
  }
}

export class ParentCampaignNotPublishedException extends BadRequestException {
  constructor(campaignId: string) {
    super(`Parent Campaign with ID ${campaignId} must be published to Meta before publishing Ad Creative.`);
  }
}

export class ParentAdSetNotPublishedException extends BadRequestException {
  constructor(adSetId: string) {
    super(`Parent Ad Set with ID ${adSetId} must be published to Meta before publishing Ad Creative.`);
  }
}

export class FacebookPublishException extends InternalServerErrorException {
  constructor(message: string, details?: any) {
    super({
      message: `Meta Graph API Creative publish failed: ${message}`,
      details,
    });
  }
}

export class TokenExpiredException extends BadRequestException {
  constructor() {
    super('Meta access token has expired or is invalid. Please reconnect your account.');
  }
}
