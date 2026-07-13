import { Injectable, OnModuleInit, Inject, Optional } from '@nestjs/common';
import { PRISMA_CLIENT } from '../../../../infrastructure/database/constants';
import { ExtendedPrismaClient } from '../../../../infrastructure/database/prisma-extensions';
import { AutomationRuleRepository } from '../../../../infrastructure/database/repositories/automation-rule.repository';
import { AutomationEvaluator } from './automation-evaluator.service';
import { AutomationDispatcher } from './automation-dispatcher.service';
import { IEventBus } from '../ports/event-bus.interface';
import { ITriggerResolver } from '../../domain/ports/trigger-resolver.interface';
import { DomainEvent } from '../../domain/models/domain-event.model';
import { IAutomationLifecycleHook } from '../../domain/ports/lifecycle-hook.interface';
import { randomUUID } from 'crypto';

@Injectable()
export class AutomationExecutionEngine implements OnModuleInit {
  constructor(
    private readonly ruleRepo: AutomationRuleRepository,
    private readonly evaluator: AutomationEvaluator,
    private readonly dispatcher: AutomationDispatcher,
    @Inject('IEventBus')
    private readonly eventBus: IEventBus,
    @Inject('ITriggerResolver')
    private readonly resolver: ITriggerResolver,
    @Inject(PRISMA_CLIENT)
    private readonly prisma: ExtendedPrismaClient,
    @Optional()
    @Inject('AUTOMATION_LIFECYCLE_HOOKS')
    private readonly hooks: IAutomationLifecycleHook[] = [],
  ) {}

  onModuleInit() {
    this.eventBus.subscribe('*', this.handleEvent.bind(this));
  }

  async executeRuleManually(
    ruleId: string,
    workspaceId: string,
    payload: any,
    userId: string,
    dryRun = false,
  ): Promise<any> {
    const rule = await this.ruleRepo.findRuleById(ruleId, workspaceId);
    if (!rule || rule.status === 'ARCHIVED') {
      throw new Error('Active rule not found or archived.');
    }

    const latestVersion = rule.versions[0];
    if (!latestVersion) {
      throw new Error('No rule version available.');
    }

    const event: DomainEvent = {
      id: randomUUID(),
      name: 'Manual',
      workspaceId,
      payload: {
        entityId: payload.entityId || 'manual',
        ...payload,
      },
      triggerVersion: '1.0',
      source: 'Manual',
      correlationId: randomUUID(),
      causationId: randomUUID(),
      occurredAt: new Date(),
      receivedAt: new Date(),
      processedAt: new Date(),
      timestamp: new Date(),
    };

    return await this.evaluateAndExecute(rule, latestVersion, event, dryRun, userId);
  }

  async handleEvent(event: DomainEvent): Promise<void> {
    const matchingRules = await this.resolver.resolveMatchingRules(event);

    for (const rule of matchingRules) {
      const activeVersion = rule.versions[0];
      if (activeVersion) {
        await this.evaluateAndExecute(rule, activeVersion, event, false, activeVersion.createdBy);
      }
    }
  }

  private async evaluateAndExecute(
    rule: any,
    version: any,
    event: DomainEvent,
    dryRun: boolean,
    userId: string,
  ): Promise<any> {
    const correlationId = randomUUID();
    const entityId = event.payload.entityId || 'workspace';
    const idempotencyKey = `${version.id}:${event.id}:${entityId}`;

    const existingAuditLog = await this.prisma.automationAuditLog.findUnique({
      where: { idempotencyKey },
    });
    if (existingAuditLog) {
      return { status: 'SKIPPED', reason: 'Idempotency key duplicate' };
    }

    const startTime = Date.now();
    let executionStatus = dryRun ? 'DRY_RUN' : 'PROCESSING';
    let triggerEvaluated = true;
    let conditionsMatched = false;
    const actionsTaken: any[] = [];
    let errorMessage: string | null = null;
    let explainability: any = {};

    const context = await this.prisma.automationExecutionContext.create({
      data: {
        ruleId: rule.id,
        versionId: version.id,
        triggerType: event.name,
        triggerEvent: event.payload as any,
        correlationId,
        matchedEntities: { entityId } as any,
        startedAt: new Date(),
      },
    });

    await this.publishEvent('Trigger Matched', event.workspaceId, correlationId, event.id, {
      ruleId: rule.id,
      versionId: version.id,
      triggerType: event.name,
    });

    try {
      for (const hook of this.hooks) {
        await hook.beforeEvaluate(context);
      }

      const ast = version.ast as any;
      const conditionNode = ast.conditionNode;

      conditionsMatched = this.evaluator.evaluate(conditionNode, event.payload);

      explainability = {
        ruleId: rule.id,
        version: version.version,
        trigger: event.name,
        payloadEvaluated: event.payload,
        conditionsMatched,
        conditionTreeSnapshot: conditionNode,
      };

      await this.publishEvent('Rule Evaluated', event.workspaceId, correlationId, context.id, {
        ruleId: rule.id,
        versionId: version.id,
        conditionsMatched,
        explainability,
      });

      if (conditionsMatched) {
        const actions = version.actions as any[];

        for (const hook of this.hooks) {
          for (const action of actions) {
            await hook.beforeDispatch(context, action);
          }
        }

        const executionPromise = (async () => {
          for (const action of actions) {
            const dispatchStart = Date.now();
            let actionResult;
            try {
              actionResult = await this.dispatcher.dispatch(action, event.workspaceId, userId, dryRun);
              actionsTaken.push({
                actionType: action.type,
                params: action.params,
                status: 'SUCCESS',
                result: actionResult,
                durationMs: Date.now() - dispatchStart,
              });
            } catch (err: any) {
              actionsTaken.push({
                actionType: action.type,
                params: action.params,
                status: 'FAILED',
                error: err.message,
                durationMs: Date.now() - dispatchStart,
              });
              throw err;
            }

            for (const hook of this.hooks) {
              await hook.afterDispatch(context, action, actionResult);
            }
          }
        })();

        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Execution Timeout')), 10000),
        );

        await Promise.race([executionPromise, timeoutPromise]);

        executionStatus = dryRun ? 'DRY_RUN' : 'SUCCESS';
      } else {
        executionStatus = 'NO_MATCH';
      }

      for (const hook of this.hooks) {
        await hook.afterComplete(context, { executionStatus, actionsTaken });
      }
    } catch (err: any) {
      if (err.message === 'Execution Timeout') {
        executionStatus = 'TIMEOUT';
      } else {
        executionStatus = 'FAILED';
      }
      errorMessage = err.message;

      for (const hook of this.hooks) {
        await hook.afterFailure(context, err);
      }
    } finally {
      const durationMs = Date.now() - startTime;

      await this.prisma.automationExecutionContext.update({
        where: { id: context.id },
        data: { finishedAt: new Date() },
      });

      await this.prisma.automationAuditLog.create({
        data: {
          ruleId: rule.id,
          versionId: version.id,
          workspaceId: event.workspaceId,
          contextId: context.id,
          idempotencyKey,
          executionStatus,
          triggerEvaluated,
          conditionsMatched,
          actionsTaken: actionsTaken as any,
          errorMessage,
          ruleSnapshot: version.ast as any,
          explainability: explainability as any,
          durationMs,
        },
      });

      await this.publishEvent('Execution Completed', event.workspaceId, correlationId, context.id, {
        ruleId: rule.id,
        versionId: version.id,
        status: executionStatus,
        durationMs,
        actionsTaken,
      });
    }

    return {
      correlationId,
      executionStatus,
      conditionsMatched,
      actionsTaken,
      errorMessage,
      explainability,
      durationMs: Date.now() - startTime,
    };
  }

  private async publishEvent(
    name: string,
    workspaceId: string,
    correlationId: string,
    causationId: string,
    payload: any,
  ): Promise<void> {
    const event: DomainEvent = {
      id: randomUUID(),
      name,
      workspaceId,
      payload,
      triggerVersion: '1.0',
      source: 'Execution Engine',
      correlationId,
      causationId,
      occurredAt: new Date(),
      receivedAt: new Date(),
      processedAt: new Date(),
      timestamp: new Date(),
    };
    await this.eventBus.publish(event);
  }
}
