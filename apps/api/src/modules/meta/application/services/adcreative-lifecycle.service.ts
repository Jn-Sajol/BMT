import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { AdCreativeLifecycleRepository } from '../../../../infrastructure/database/repositories/adcreative-lifecycle.repository';
import { MetaConnectionRepository } from '../../../../infrastructure/database/repositories/meta-connection.repository';
import { AdCreativeLifecyclePublisher } from './adcreative-creative-publisher';
import { UpdateAdCreativeDto, AdCreativeLifecycleHistoryDto } from './adcreative-lifecycle.dto';
import { AdCreativeLifecycleMapper } from './adcreative-lifecycle.mapper';
import {
  AdCreativeNotPublishedException,
  AdCreativeRecreationRequiredException,
  MetaOperationFailedException,
} from '../../../../common/exceptions/adcreative-lifecycle.exceptions';
import { IClockProvider } from '../../../../common/ports/clock-provider.interface';
import { CLOCK_PROVIDER } from '../../../../infrastructure/security/security.module';
import { IEncryption } from '../../../../common/ports/encryption.interface';
import { ENCRYPTION_SERVICE } from '../../../../infrastructure/security/security.module';

@Injectable()
export class AdCreativeLifecycleService {
  constructor(
    private readonly lifecycleRepo: AdCreativeLifecycleRepository,
    private readonly connectionRepo: MetaConnectionRepository,
    private readonly publisher: AdCreativeLifecyclePublisher,
    @Inject(CLOCK_PROVIDER)
    private readonly clockProvider: IClockProvider,
    @Inject(ENCRYPTION_SERVICE)
    private readonly encryptionService: IEncryption,
  ) {}

  async updateAdCreative(
    creativeId: string,
    workspaceId: string,
    userId: string,
    dto: UpdateAdCreativeDto,
  ): Promise<AdCreativeLifecycleHistoryDto> {
    const creative = await this.lifecycleRepo.findById(creativeId);
    if (!creative || creative.campaign.workspaceId !== workspaceId) {
      throw new NotFoundException('Ad Creative not found.');
    }

    if (!creative.externalCreativeId) {
      throw new AdCreativeNotPublishedException(creativeId);
    }

    const hasImmutableChanges =
      dto.primaryText !== undefined ||
      dto.headline !== undefined ||
      dto.destinationUrl !== undefined;

    if (hasImmutableChanges) {
      throw new AdCreativeRecreationRequiredException(creativeId);
    }

    const accessToken = await this.getAccessToken(workspaceId);

    try {
      const response = await this.publisher.updateAdCreative(
        creative.externalCreativeId,
        { name: dto.name },
        accessToken,
      );

      const history = await this.lifecycleRepo.insertHistory(
        creativeId,
        'UPDATE_NAME',
        creative.status,
        creative.status,
        userId,
        this.clockProvider.now(),
        response,
      );

      return AdCreativeLifecycleMapper.toHistoryDto(history);
    } catch (err: any) {
      throw new MetaOperationFailedException(err.message);
    }
  }

  private async getAccessToken(workspaceId: string): Promise<string> {
    const connection = await this.connectionRepo.findByWorkspaceId(workspaceId);
    if (!connection || connection.status !== 'ACTIVE') {
      throw new NotFoundException('Active Meta Connection not found for workspace.');
    }

    const decrypted = this.encryptionService.decrypt(connection.encryptedAccessToken);
    if (!decrypted) {
      throw new Error('Failed to decrypt Meta connection token.');
    }

    return decrypted;
  }
}
