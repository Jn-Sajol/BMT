import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { IWebhookHandler } from '../../application/ports/webhook-handler.interface';
import { AdLifecycleRepository } from '../../../../infrastructure/database/repositories/ad-lifecycle.repository';
import { IClockProvider } from '../../../../common/ports/clock-provider.interface';
import { CLOCK_PROVIDER } from '../../../../infrastructure/security/security.module';
import { CampaignStatus } from '@prisma/client';

@Injectable()
export class MetaWebhookHandler implements IWebhookHandler {
  constructor(
    private readonly adRepo: AdLifecycleRepository,
    @Inject(CLOCK_PROVIDER)
    private readonly clockProvider: IClockProvider,
  ) {}

  supports(provider: string, eventType: string): boolean {
    return provider === 'meta' && (eventType === 'ad_review' || eventType === 'ads_status');
  }

  async handle(payload: any): Promise<void> {
    const entry = payload.entry?.[0];
    const change = entry?.changes?.[0];
    if (!change) return;

    const value = change.value;
    if (!value) return;

    const facebookAdId = value.ad_id || value.id;
    if (!facebookAdId) return;

    const ad = await this.adRepo.findByExternalAdId(facebookAdId);
    if (!ad) {
      throw new NotFoundException(`Ad with external ID ${facebookAdId} not found during webhook routing.`);
    }

    if (!ad.workspaceId) {
      throw new Error(`Workspace isolation validation failed for Facebook Ad ID ${facebookAdId}`);
    }

    const effectiveStatus = value.status || 'ACTIVE';

    await this.adRepo.updateAdStatus(
      ad.id,
      CampaignStatus.PUBLISHED,
      effectiveStatus,
      this.clockProvider.now(),
      payload,
      '00000000-0000-0000-0000-000000000000',
    );
  }
}
