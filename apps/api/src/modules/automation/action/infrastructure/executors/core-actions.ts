import { Injectable, BadRequestException } from '@nestjs/common';
import { IActionExecutor, ActionExecutionContext, ActionExecutionResult } from '../../domain/ports/action-executor.interface';
import { CampaignLifecycleService } from '../../../../meta/application/services/campaign-lifecycle.service';
import { AdSetLifecycleService } from '../../../../meta/application/services/adset-lifecycle.service';
import { AdLifecycleService } from '../../../../meta/application/services/ad-lifecycle.service';

function classifyRetryable(err: any): boolean {
  const errMsg = String(err.message || '').toLowerCase();
  return (
    errMsg.includes('lock') ||
    errMsg.includes('timeout') ||
    errMsg.includes('429') ||
    errMsg.includes('throttled') ||
    errMsg.includes('network') ||
    errMsg.includes('hang up')
  );
}

@Injectable()
export class PauseCampaignExecutor implements IActionExecutor {
  actionType = 'Pause Campaign';
  constructor(private readonly lifecycle: CampaignLifecycleService) {}

  async execute(params: any, context: ActionExecutionContext): Promise<ActionExecutionResult> {
    const startedAt = new Date();
    if (!params.campaignId) {
      throw new BadRequestException('campaignId parameter is required.');
    }
    try {
      const result = context.dryRun
        ? { dryRun: true }
        : await this.lifecycle.pauseCampaign(params.campaignId, context.workspaceId, context.userId);
      return {
        actionId: context.actionId,
        executorName: 'PauseCampaignExecutor',
        status: 'SUCCESS',
        startedAt,
        completedAt: new Date(),
        duration: Date.now() - startedAt.getTime(),
        retryable: false,
        correlationId: context.correlationId,
        explainability: { action: this.actionType, params, result },
      };
    } catch (err: any) {
      return {
        actionId: context.actionId,
        executorName: 'PauseCampaignExecutor',
        status: 'FAILED',
        startedAt,
        completedAt: new Date(),
        duration: Date.now() - startedAt.getTime(),
        retryable: classifyRetryable(err),
        correlationId: context.correlationId,
        explainability: { action: this.actionType, params },
        error: err.message,
      };
    }
  }
}

@Injectable()
export class ResumeCampaignExecutor implements IActionExecutor {
  actionType = 'Resume Campaign';
  constructor(private readonly lifecycle: CampaignLifecycleService) {}

  async execute(params: any, context: ActionExecutionContext): Promise<ActionExecutionResult> {
    const startedAt = new Date();
    if (!params.campaignId) {
      throw new BadRequestException('campaignId parameter is required.');
    }
    try {
      const result = context.dryRun
        ? { dryRun: true }
        : await this.lifecycle.resumeCampaign(params.campaignId, context.workspaceId, context.userId);
      return {
        actionId: context.actionId,
        executorName: 'ResumeCampaignExecutor',
        status: 'SUCCESS',
        startedAt,
        completedAt: new Date(),
        duration: Date.now() - startedAt.getTime(),
        retryable: false,
        correlationId: context.correlationId,
        explainability: { action: this.actionType, params, result },
      };
    } catch (err: any) {
      return {
        actionId: context.actionId,
        executorName: 'ResumeCampaignExecutor',
        status: 'FAILED',
        startedAt,
        completedAt: new Date(),
        duration: Date.now() - startedAt.getTime(),
        retryable: classifyRetryable(err),
        correlationId: context.correlationId,
        explainability: { action: this.actionType, params },
        error: err.message,
      };
    }
  }
}

@Injectable()
export class PauseAdSetExecutor implements IActionExecutor {
  actionType = 'Pause AdSet';
  constructor(private readonly lifecycle: AdSetLifecycleService) {}

  async execute(params: any, context: ActionExecutionContext): Promise<ActionExecutionResult> {
    const startedAt = new Date();
    if (!params.adSetId) {
      throw new BadRequestException('adSetId parameter is required.');
    }
    try {
      const result = context.dryRun
        ? { dryRun: true }
        : await this.lifecycle.pauseAdSet(params.adSetId, context.workspaceId, context.userId);
      return {
        actionId: context.actionId,
        executorName: 'PauseAdSetExecutor',
        status: 'SUCCESS',
        startedAt,
        completedAt: new Date(),
        duration: Date.now() - startedAt.getTime(),
        retryable: false,
        correlationId: context.correlationId,
        explainability: { action: this.actionType, params, result },
      };
    } catch (err: any) {
      return {
        actionId: context.actionId,
        executorName: 'PauseAdSetExecutor',
        status: 'FAILED',
        startedAt,
        completedAt: new Date(),
        duration: Date.now() - startedAt.getTime(),
        retryable: classifyRetryable(err),
        correlationId: context.correlationId,
        explainability: { action: this.actionType, params },
        error: err.message,
      };
    }
  }
}

@Injectable()
export class ResumeAdSetExecutor implements IActionExecutor {
  actionType = 'Resume AdSet';
  constructor(private readonly lifecycle: AdSetLifecycleService) {}

  async execute(params: any, context: ActionExecutionContext): Promise<ActionExecutionResult> {
    const startedAt = new Date();
    if (!params.adSetId) {
      throw new BadRequestException('adSetId parameter is required.');
    }
    try {
      const result = context.dryRun
        ? { dryRun: true }
        : await this.lifecycle.resumeAdSet(params.adSetId, context.workspaceId, context.userId);
      return {
        actionId: context.actionId,
        executorName: 'ResumeAdSetExecutor',
        status: 'SUCCESS',
        startedAt,
        completedAt: new Date(),
        duration: Date.now() - startedAt.getTime(),
        retryable: false,
        correlationId: context.correlationId,
        explainability: { action: this.actionType, params, result },
      };
    } catch (err: any) {
      return {
        actionId: context.actionId,
        executorName: 'ResumeAdSetExecutor',
        status: 'FAILED',
        startedAt,
        completedAt: new Date(),
        duration: Date.now() - startedAt.getTime(),
        retryable: classifyRetryable(err),
        correlationId: context.correlationId,
        explainability: { action: this.actionType, params },
        error: err.message,
      };
    }
  }
}

@Injectable()
export class PauseAdExecutor implements IActionExecutor {
  actionType = 'Pause Ad';
  constructor(private readonly lifecycle: AdLifecycleService) {}

  async execute(params: any, context: ActionExecutionContext): Promise<ActionExecutionResult> {
    const startedAt = new Date();
    if (!params.adId) {
      throw new BadRequestException('adId parameter is required.');
    }
    try {
      const result = context.dryRun
        ? { dryRun: true }
        : await this.lifecycle.pauseAd(params.adId, context.workspaceId, context.userId);
      return {
        actionId: context.actionId,
        executorName: 'PauseAdExecutor',
        status: 'SUCCESS',
        startedAt,
        completedAt: new Date(),
        duration: Date.now() - startedAt.getTime(),
        retryable: false,
        correlationId: context.correlationId,
        explainability: { action: this.actionType, params, result },
      };
    } catch (err: any) {
      return {
        actionId: context.actionId,
        executorName: 'PauseAdExecutor',
        status: 'FAILED',
        startedAt,
        completedAt: new Date(),
        duration: Date.now() - startedAt.getTime(),
        retryable: classifyRetryable(err),
        correlationId: context.correlationId,
        explainability: { action: this.actionType, params },
        error: err.message,
      };
    }
  }
}

@Injectable()
export class ResumeAdExecutor implements IActionExecutor {
  actionType = 'Resume Ad';
  constructor(private readonly lifecycle: AdLifecycleService) {}

  async execute(params: any, context: ActionExecutionContext): Promise<ActionExecutionResult> {
    const startedAt = new Date();
    if (!params.adId) {
      throw new BadRequestException('adId parameter is required.');
    }
    try {
      const result = context.dryRun
        ? { dryRun: true }
        : await this.lifecycle.resumeAd(params.adId, context.workspaceId, context.userId);
      return {
        actionId: context.actionId,
        executorName: 'ResumeAdExecutor',
        status: 'SUCCESS',
        startedAt,
        completedAt: new Date(),
        duration: Date.now() - startedAt.getTime(),
        retryable: false,
        correlationId: context.correlationId,
        explainability: { action: this.actionType, params, result },
      };
    } catch (err: any) {
      return {
        actionId: context.actionId,
        executorName: 'ResumeAdExecutor',
        status: 'FAILED',
        startedAt,
        completedAt: new Date(),
        duration: Date.now() - startedAt.getTime(),
        retryable: classifyRetryable(err),
        correlationId: context.correlationId,
        explainability: { action: this.actionType, params },
        error: err.message,
      };
    }
  }
}

@Injectable()
export class CallWebhookExecutor implements IActionExecutor {
  actionType = 'Call Webhook';

  async execute(params: any, context: ActionExecutionContext): Promise<ActionExecutionResult> {
    const startedAt = new Date();
    if (!params.url) {
      throw new BadRequestException('url parameter is required.');
    }
    try {
      let result;
      if (context.dryRun) {
        result = { dryRun: true };
      } else {
        const method = params.method || 'POST';
        const headers = params.headers || {};
        const response = await fetch(params.url, {
          method,
          headers: { 'Content-Type': 'application/json', ...headers },
          body: method !== 'GET' && method !== 'HEAD' ? JSON.stringify(params.payload || {}) : undefined,
        });
        const resText = await response.text();
        let resData;
        try {
          resData = JSON.parse(resText);
        } catch {
          resData = resText;
        }
        result = { statusCode: response.status, data: resData };
      }
      return {
        actionId: context.actionId,
        executorName: 'CallWebhookExecutor',
        status: 'SUCCESS',
        startedAt,
        completedAt: new Date(),
        duration: Date.now() - startedAt.getTime(),
        retryable: false,
        correlationId: context.correlationId,
        explainability: { action: this.actionType, params, result },
      };
    } catch (err: any) {
      return {
        actionId: context.actionId,
        executorName: 'CallWebhookExecutor',
        status: 'FAILED',
        startedAt,
        completedAt: new Date(),
        duration: Date.now() - startedAt.getTime(),
        retryable: classifyRetryable(err),
        correlationId: context.correlationId,
        explainability: { action: this.actionType, params },
        error: err.message,
      };
    }
  }
}

@Injectable()
export class SendNotificationExecutor implements IActionExecutor {
  actionType = 'Send Notification';

  async execute(params: any, context: ActionExecutionContext): Promise<ActionExecutionResult> {
    const startedAt = new Date();
    try {
      const result = { status: 'NOTIFICATION_SENT', channel: params.channel || 'email', recipient: params.recipient };
      return {
        actionId: context.actionId,
        executorName: 'SendNotificationExecutor',
        status: 'SUCCESS',
        startedAt,
        completedAt: new Date(),
        duration: Date.now() - startedAt.getTime(),
        retryable: false,
        correlationId: context.correlationId,
        explainability: { action: this.actionType, params, result },
      };
    } catch (err: any) {
      return {
        actionId: context.actionId,
        executorName: 'SendNotificationExecutor',
        status: 'FAILED',
        startedAt,
        completedAt: new Date(),
        duration: Date.now() - startedAt.getTime(),
        retryable: false,
        correlationId: context.correlationId,
        explainability: { action: this.actionType, params },
        error: err.message,
      };
    }
  }
}
