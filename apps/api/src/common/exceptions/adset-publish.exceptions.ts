import { BadRequestException, InternalServerErrorException } from '@nestjs/common';

export class AdSetAlreadyPublishedException extends BadRequestException {
  constructor(adSetId: string) {
    super(`Ad Set with ID ${adSetId} has already been published to Meta.`);
  }
}

export class CampaignNotPublishedException extends BadRequestException {
  constructor(campaignId: string) {
    super(`Parent Campaign with ID ${campaignId} must be published to Meta before publishing Ad Set.`);
  }
}

export class AdSetValidationException extends BadRequestException {
  constructor(message: string) {
    super(`Ad Set validation failed: ${message}`);
  }
}

export class AdSetPublishException extends InternalServerErrorException {
  constructor(message: string, details?: any) {
    super({
      message: `Failed to publish Ad Set to Meta: ${message}`,
      details,
    });
  }
}
