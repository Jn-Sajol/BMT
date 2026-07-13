import { Injectable, Inject } from '@nestjs/common';
import { INotificationPreferenceStore } from '../../domain/ports/preference-store.interface';
import { PRISMA_CLIENT } from '../../../../../infrastructure/database/constants';
import { ExtendedPrismaClient } from '../../../../../infrastructure/database/prisma-extensions';

@Injectable()
export class NotificationPreferenceService implements INotificationPreferenceStore {
  constructor(
    @Inject(PRISMA_CLIENT)
    private readonly prisma: ExtendedPrismaClient,
  ) {}

  async isChannelAllowed(workspaceId: string, userId: string, channel: string, severity: string): Promise<boolean> {
    const pref = await this.prisma.automationNotificationPreference.findFirst({
      where: { workspaceId, userId, channel: channel.toUpperCase() },
    });

    if (pref) {
      if (!pref.enabled) {
        return false;
      }
      
      const levelWeights: Record<string, number> = { INFO: 1, WARNING: 2, ERROR: 3, CRITICAL: 4 };
      const minWeight = levelWeights[pref.severityLevel.toUpperCase()] || 1;
      const targetWeight = levelWeights[severity.toUpperCase()] || 1;

      if (targetWeight < minWeight) {
        return false;
      }
    }

    const quiet = await this.getQuietHours(workspaceId, userId);
    if (quiet && quiet.enabled) {
      const currentHour = new Date().getHours();
      if (quiet.startHour <= quiet.endHour) {
        if (currentHour >= quiet.startHour && currentHour <= quiet.endHour) {
          return false;
        }
      } else {
        if (currentHour >= quiet.startHour || currentHour <= quiet.endHour) {
          return false;
        }
      }
    }

    return true;
  }

  async getQuietHours(workspaceId: string, userId: string): Promise<{ startHour: number; endHour: number; enabled: boolean } | null> {
    return {
      startHour: 22,
      endHour: 6,
      enabled: false,
    };
  }
}
