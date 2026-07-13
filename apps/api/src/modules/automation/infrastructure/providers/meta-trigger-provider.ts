import { Injectable } from '@nestjs/common';
import { ITriggerProvider } from '../../domain/ports/trigger-provider.interface';
import { DomainEvent } from '../../domain/models/domain-event.model';
import { randomUUID } from 'crypto';

@Injectable()
export class MetaTriggerProvider implements ITriggerProvider {
  providerName = 'meta';

  supports(source: string): boolean {
    const metaSources = ['Webhook', 'Scheduler', 'Insights Sync', 'Status Sync', 'Manual', 'Lifecycle'];
    return metaSources.includes(source);
  }

  async normalize(
    rawPayload: any,
    metadata: {
      workspaceId: string;
      correlationId: string;
      causationId: string;
      source: string;
      receivedAt: Date;
    },
  ): Promise<DomainEvent[]> {
    const events: DomainEvent[] = [];
    const occurredAt = rawPayload.occurredAt ? new Date(rawPayload.occurredAt) : new Date();

    if (metadata.source === 'Webhook') {
      if (rawPayload.entry && Array.isArray(rawPayload.entry)) {
        for (const entry of rawPayload.entry) {
          if (entry.changes && Array.isArray(entry.changes)) {
            for (const change of entry.changes) {
              events.push({
                id: randomUUID(),
                name: 'Webhook Received',
                workspaceId: metadata.workspaceId,
                payload: {
                  entityId: entry.id || 'unknown',
                  field: change.field,
                  value: change.value,
                  rawChange: change,
                },
                triggerVersion: '1.0',
                source: metadata.source,
                correlationId: metadata.correlationId,
                causationId: metadata.causationId,
                occurredAt,
                receivedAt: metadata.receivedAt,
                processedAt: new Date(),
                timestamp: occurredAt,
              });
            }
          }
        }
      } else {
        events.push({
          id: randomUUID(),
          name: 'Webhook Received',
          workspaceId: metadata.workspaceId,
          payload: {
            entityId: rawPayload.entityId || 'unknown',
            ...rawPayload,
          },
          triggerVersion: '1.0',
          source: metadata.source,
          correlationId: metadata.correlationId,
          causationId: metadata.causationId,
          occurredAt,
          receivedAt: metadata.receivedAt,
          processedAt: new Date(),
          timestamp: occurredAt,
        });
      }
    } else if (metadata.source === 'Insights Sync') {
      events.push({
        id: randomUUID(),
        name: 'Insights Synced',
        workspaceId: metadata.workspaceId,
        payload: {
          entityId: rawPayload.campaignId || rawPayload.adSetId || rawPayload.adId || 'unknown',
          spend: Number(rawPayload.spend || 0),
          reach: Number(rawPayload.reach || 0),
          impressions: Number(rawPayload.impressions || 0),
          ctr: Number(rawPayload.ctr || 0),
          cpc: Number(rawPayload.cpc || 0),
          cpm: Number(rawPayload.cpm || 0),
          roas: Number(rawPayload.roas || 0),
          frequency: Number(rawPayload.frequency || 0),
        },
        triggerVersion: '1.0',
        source: metadata.source,
        correlationId: metadata.correlationId,
        causationId: metadata.causationId,
        occurredAt,
        receivedAt: metadata.receivedAt,
        processedAt: new Date(),
        timestamp: occurredAt,
      });
    } else if (metadata.source === 'Status Sync') {
      events.push({
        id: randomUUID(),
        name: 'Status Changed',
        workspaceId: metadata.workspaceId,
        payload: {
          entityId: rawPayload.entityId || 'unknown',
          status: rawPayload.status,
          effectiveStatus: rawPayload.effectiveStatus,
        },
        triggerVersion: '1.0',
        source: metadata.source,
        correlationId: metadata.correlationId,
        causationId: metadata.causationId,
        occurredAt,
        receivedAt: metadata.receivedAt,
        processedAt: new Date(),
        timestamp: occurredAt,
      });
    } else if (metadata.source === 'Scheduler') {
      events.push({
        id: randomUUID(),
        name: 'Schedule',
        workspaceId: metadata.workspaceId,
        payload: {
          entityId: 'scheduler',
          cron: rawPayload.cron,
        },
        triggerVersion: '1.0',
        source: metadata.source,
        correlationId: metadata.correlationId,
        causationId: metadata.causationId,
        occurredAt,
        receivedAt: metadata.receivedAt,
        processedAt: new Date(),
        timestamp: occurredAt,
      });
    } else if (metadata.source === 'Manual') {
      events.push({
        id: randomUUID(),
        name: 'Manual',
        workspaceId: metadata.workspaceId,
        payload: {
          entityId: rawPayload.entityId || 'manual',
          ...rawPayload,
        },
        triggerVersion: '1.0',
        source: metadata.source,
        correlationId: metadata.correlationId,
        causationId: metadata.causationId,
        occurredAt,
        receivedAt: metadata.receivedAt,
        processedAt: new Date(),
        timestamp: occurredAt,
      });
    } else if (metadata.source === 'Lifecycle') {
      events.push({
        id: randomUUID(),
        name: rawPayload.eventName,
        workspaceId: metadata.workspaceId,
        payload: {
          entityId: rawPayload.entityId || 'unknown',
          status: rawPayload.status,
        },
        triggerVersion: '1.0',
        source: metadata.source,
        correlationId: metadata.correlationId,
        causationId: metadata.causationId,
        occurredAt,
        receivedAt: metadata.receivedAt,
        processedAt: new Date(),
        timestamp: occurredAt,
      });
    }

    return events;
  }
}
