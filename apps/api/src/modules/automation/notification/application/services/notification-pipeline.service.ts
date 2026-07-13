import { Injectable, OnModuleInit, OnApplicationBootstrap, OnApplicationShutdown, Inject } from '@nestjs/common';
import { IEventBus } from '../../../application/ports/event-bus.interface';
import { DomainEvent } from '../../../domain/models/domain-event.model';
import { TemplateEngineService } from './template-engine.service';
import { ProviderRegistryService } from './provider-registry.service';
import { NotificationPreferenceService } from './notification-preference.service';
import { PRISMA_CLIENT } from '../../../../../infrastructure/database/constants';
import { ExtendedPrismaClient } from '../../../../../infrastructure/database/prisma-extensions';
import { randomUUID } from 'crypto';

@Injectable()
export class NotificationPipelineService implements OnModuleInit, OnApplicationBootstrap, OnApplicationShutdown {
  private workerTimer?: NodeJS.Timeout;
  private isShuttingDown = false;

  constructor(
    @Inject('IEventBus')
    private readonly eventBus: IEventBus,
    private readonly templates: TemplateEngineService,
    private readonly providers: ProviderRegistryService,
    private readonly preferences: NotificationPreferenceService,
    @Inject(PRISMA_CLIENT)
    private readonly prisma: ExtendedPrismaClient,
  ) {}

  onModuleInit() {
    this.eventBus.subscribe('*', this.handleEvent.bind(this));
  }

  onApplicationBootstrap() {
    this.isShuttingDown = false;
    this.workerTimer = setInterval(() => this.processPendingDeliveries(), 5000);
  }

  onApplicationShutdown() {
    this.isShuttingDown = true;
    if (this.workerTimer) clearInterval(this.workerTimer);
  }

  async handleEvent(event: DomainEvent): Promise<void> {
    const targetNames = [
      'Workflow Published', 'Workflow Failed', 'Workflow Validated',
      'Rule Triggered', 'Rule Failed', 'Action Completed', 'Action Failed',
      'Insights Sync Completed', 'Insights Sync Failed', 'Scheduler Triggered',
      'Circuit Breaker Opened', 'Retry Exhausted', 'Dead Letter Created',
      'Provider Connected', 'Provider Disconnected',
    ];

    if (!targetNames.includes(event.name)) {
      return;
    }

    try {
      const severity = event.name.toLowerCase().includes('failed') || event.name.toLowerCase().includes('opened') ? 'ERROR' : 'INFO';
      const payload = event.payload || {};

      const notification = await this.prisma.automationNotification.create({
        data: {
          workspaceId: event.workspaceId,
          eventName: event.name,
          payload: payload as any,
          severity,
        },
      });

      await this.publishEvent('Notification Created', event.workspaceId, notification.id, { notificationId: notification.id });

      const userId = payload.userId || '00000000-0000-0000-0000-000000000000';
      const channels = this.providers.getChannels();

      for (const channel of channels) {
        const allowed = await this.preferences.isChannelAllowed(event.workspaceId, userId, channel, severity);
        if (!allowed) continue;

        let template = await this.prisma.automationNotificationTemplate.findFirst({
          where: { name: event.name },
        });

        if (!template) {
          template = await this.prisma.automationNotificationTemplate.create({
            data: {
              name: event.name,
              subject: `BMT Notification: ${event.name}`,
              body: `Event {{eventName}} occurred inside workspace {{workspaceId}}.`,
            },
          });
        }

        const vars = {
          eventName: event.name,
          workspaceId: event.workspaceId,
          details: JSON.stringify(payload),
        };

        const renderedBody = this.templates.render(template.body, vars);

        const delivery = await this.prisma.automationNotificationDelivery.create({
          data: {
            notificationId: notification.id,
            channel,
            recipient: payload.recipient || (channel === 'EMAIL' ? 'recipient@bmt.io' : 'webhook-url-or-slack-webhook'),
            status: 'PENDING',
          },
        });

        await this.publishEvent('Notification Queued', event.workspaceId, delivery.id, { deliveryId: delivery.id });
      }
    } catch (err) {
      console.error('Notification Pipeline error processing event:', err);
    }
  }

  private async processPendingDeliveries() {
    if (this.isShuttingDown) return;

    try {
      const pending = await this.prisma.automationNotificationDelivery.findMany({
        where: { status: 'PENDING' },
        take: 10,
      });

      for (const delivery of pending) {
        const updated = await this.prisma.automationNotificationDelivery.updateMany({
          where: { id: delivery.id, status: 'PENDING' },
          data: { status: 'PROCESSING' },
        });

        if (updated.count === 0) continue;

        const parent = await this.prisma.automationNotification.findUnique({
          where: { id: delivery.notificationId },
        });

        const provider = this.providers.resolve(delivery.channel);
        if (!provider || !parent) {
          await this.prisma.automationNotificationDelivery.update({
            where: { id: delivery.id },
            data: { status: 'FAILED', error: 'No compatible channel provider registered.' },
          });
          await this.publishEvent('Notification Failed', parent?.workspaceId || 'global', delivery.id, { deliveryId: delivery.id, error: 'No compatible channel provider registered.' });
          continue;
        }

        try {
          const result = await provider.send({
            recipient: delivery.recipient,
            subject: `Alert: ${parent.eventName}`,
            body: `Alert context: ${JSON.stringify(parent.payload)}`,
          });

          if (result.success) {
            await this.prisma.automationNotificationDelivery.update({
              where: { id: delivery.id },
              data: { status: 'SENT' },
            });
            await this.publishEvent('Notification Delivered', parent.workspaceId, delivery.id, { deliveryId: delivery.id });
          } else {
            throw new Error(result.error || 'Delivery failed.');
          }
        } catch (err: any) {
          const newRetryCount = delivery.retryCount + 1;
          if (newRetryCount >= 5) {
            await this.prisma.automationNotificationDelivery.update({
              where: { id: delivery.id },
              data: { status: 'DEAD_LETTERED', error: err.message },
            });
            await this.publishEvent('Notification Dead Letter', parent.workspaceId, delivery.id, { deliveryId: delivery.id, error: err.message });
          } else {
            await this.prisma.automationNotificationDelivery.update({
              where: { id: delivery.id },
              data: { status: 'PENDING', retryCount: newRetryCount, error: err.message },
            });
            await this.publishEvent('Notification Retried', parent.workspaceId, delivery.id, { deliveryId: delivery.id, attempt: newRetryCount });
          }
        }
      }
    } catch {
      // Resilient pass
    }
  }

  private async publishEvent(name: string, workspaceId: string, causationId: string, payload: any) {
    const event: DomainEvent = {
      id: randomUUID(),
      name,
      workspaceId,
      payload: {
        entityId: causationId,
        ...payload,
      },
      triggerVersion: '1.0',
      source: 'Notification Engine',
      correlationId: randomUUID(),
      causationId,
      occurredAt: new Date(),
      receivedAt: new Date(),
      processedAt: new Date(),
      timestamp: new Date(),
    };
    await this.eventBus.publish(event);
  }
}
