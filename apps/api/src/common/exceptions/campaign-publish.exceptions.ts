import { BadRequestException, NotFoundException, InternalServerErrorException } from '@nestjs/common';

export class CampaignAlreadyPublishedException extends BadRequestException {
  constructor(campaignId: string) {
    super(`Campaign with ID ${campaignId} has already been published to Meta.`);
  }
}

export class MetaConnectionNotFoundException extends NotFoundException {
  constructor(workspaceId: string) {
    super(`No active Meta Connection found for workspace ${workspaceId}.`);
  }
}

export class WorkspaceMismatchException extends BadRequestException {
  constructor() {
    super(`Campaign workspace context does not match active request workspace context.`);
  }
}

export class CampaignValidationException extends BadRequestException {
  constructor(message: string) {
    super(`Campaign validation failed: ${message}`);
  }
}

export class MetaPublishException extends InternalServerErrorException {
  constructor(message: string, details?: any) {
    super({
      message: `Failed to publish campaign to Meta: ${message}`,
      details,
    });
  }
}
