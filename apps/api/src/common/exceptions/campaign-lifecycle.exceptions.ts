import { BadRequestException } from '@nestjs/common';

export class CampaignNotPublishedException extends BadRequestException {
  constructor(campaignId: string) {
    super(`Campaign with ID ${campaignId} is not published to Facebook.`);
  }
}

export class CampaignArchivedException extends BadRequestException {
  constructor(campaignId: string) {
    super(`Campaign with ID ${campaignId} is archived and cannot be modified.`);
  }
}

export class MetaOperationFailedException extends BadRequestException {
  constructor(message: string) {
    super(`Meta Graph API operation failed: ${message}`);
  }
}

export class CampaignAlreadyPausedException extends BadRequestException {
  constructor(campaignId: string) {
    super(`Campaign with ID ${campaignId} is already paused.`);
  }
}

export class CampaignAlreadyActiveException extends BadRequestException {
  constructor(campaignId: string) {
    super(`Campaign with ID ${campaignId} is already active.`);
  }
}
