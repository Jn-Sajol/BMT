import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import { IActionRegistry } from '../../domain/ports/action-registry.interface';
import { ActionExecutionContext, ActionExecutionResult } from '../../domain/ports/action-executor.interface';
import { IEventBus } from '../../../application/ports/event-bus.interface';
import { DomainEvent } from '../../../domain/models/domain-event.model';
import { randomUUID } from 'crypto';

@Injectable()
export class ActionResolver {
  constructor(
    @Inject('IActionRegistry')
    private readonly registry: IActionRegistry,
    @Inject('IEventBus')
    private readonly eventBus: IEventBus,
  ) {}

  async executeActions(
    actions: any[],
    policy = 'Sequential Execution',
    context: Omit<ActionExecutionContext, 'actionId'>,
  ): Promise<ActionExecutionResult[]> {
    const results: ActionExecutionResult[] = [];

    for (const action of actions) {
      const actionId = action.id || randomUUID();
      const actionType = action.type;
      const params = action.params || {};
      const entityId = params.campaignId || params.adSetId || params.adId || 'unknown';

      const executor = this.registry.getExecutor(actionType);
      if (!executor) {
        const startedAt = new Date();
        const failedResult: ActionExecutionResult = {
          actionId,
          executorName: 'Unknown',
          status: 'FAILED',
          startedAt,
          completedAt: new Date(),
          duration: 0,
          retryable: false,
          correlationId: context.correlationId,
          explainability: { actionType, params },
          error: `No action executor found for action type: ${actionType}`,
        };
        results.push(failedResult);
        await this.publishEvent(failedResult, context.workspaceId, entityId);

        if (policy === 'Stop On First Failure') {
          break;
        }
        continue;
      }

      const actionContext: ActionExecutionContext = {
        ...context,
        actionId,
      };

      const startMs = Date.now();
      const executePromise = executor.execute(params, actionContext);
      const timeoutPromise = new Promise<ActionExecutionResult>((_, reject) =>
        setTimeout(() => reject(new Error(`Action ${actionType} timed out after 10s`)), 10000)
      );

      try {
        const res = await Promise.race([executePromise, timeoutPromise]);
        results.push(res);
        await this.publishEvent(res, context.workspaceId, entityId);

        if (res.status === 'FAILED' && policy === 'Stop On First Failure') {
          break;
        }
      } catch (err: any) {
        const failedResult: ActionExecutionResult = {
          actionId,
          executorName: executor.constructor.name,
          status: 'FAILED',
          startedAt: new Date(startMs),
          completedAt: new Date(),
          duration: Date.now() - startMs,
          retryable: true,
          correlationId: context.correlationId,
          explainability: { actionType, params },
          error: err.message,
        };
        results.push(failedResult);
        await this.publishEvent(failedResult, context.workspaceId, entityId);

        if (policy === 'Stop On First Failure') {
          break;
        }
      }
    }

    return results;
  }

  private async publishEvent(res: ActionExecutionResult, workspaceId: string, entityId: string) {
    const event: DomainEvent = {
      id: randomUUID(),
      name: 'Action Completed',
      workspaceId,
      payload: {
        entityId,
        result: res,
      },
      triggerVersion: '1.0',
      source: 'Action Library',
      correlationId: res.correlationId,
      causationId: res.actionId,
      occurredAt: res.completedAt,
      receivedAt: res.startedAt,
      processedAt: new Date(),
      timestamp: res.completedAt,
    };
    await this.eventBus.publish(event);
  }
}
