import { Controller, Get, Post, Param, Query, HttpCode, HttpStatus, NotFoundException } from '@nestjs/common';
import { Queue } from 'bullmq';
import Redis from 'ioredis';

@Controller('automations')
export class ExecutionMonitorController {
  private queue: Queue;

  constructor() {
    const host = process.env.REDIS_HOST || 'localhost';
    const port = parseInt(process.env.REDIS_PORT || '6379', 10);
    const password = process.env.REDIS_PASSWORD || undefined;

    const connection = new Redis({
      host,
      port,
      password,
      maxRetriesPerRequest: null,
    });

    this.queue = new Queue('workflow-executions', { connection });
  }

  @Get('workflows/:id/executions')
  getExecutionHistory(
    @Param('id') workflowId: string,
    @Query('workspaceId') workspaceId?: string,
  ) {
    // Return mock historical run records
    return [
      {
        id: 'run-101',
        workflowId,
        workspaceId: workspaceId || 'ws-100',
        triggerType: 'cron',
        startedAt: new Date(Date.now() - 3600000).toISOString(),
        finishedAt: new Date(Date.now() - 3590000).toISOString(),
        durationMs: 10000,
        status: 'COMPLETED',
        correlationId: 'corr-xyz-101',
      },
      {
        id: 'run-102',
        workflowId,
        workspaceId: workspaceId || 'ws-100',
        triggerType: 'manual',
        startedAt: new Date(Date.now() - 1800000).toISOString(),
        finishedAt: new Date(Date.now() - 1795000).toISOString(),
        durationMs: 5000,
        status: 'FAILED',
        correlationId: 'corr-xyz-102',
      },
    ];
  }

  @Get('executions/:id/timeline')
  getExecutionTimeline(@Param('id') executionId: string) {
    if (executionId === 'run-101') {
      return [
        { nodeId: 'node-1', nodeType: 'webhook-trigger', durationMs: 120, status: 'SUCCESS' },
        { nodeId: 'node-2', nodeType: 'openai-prompt', durationMs: 1450, status: 'SUCCESS' },
      ];
    }
    if (executionId === 'run-102') {
      return [
        { nodeId: 'node-1', nodeType: 'webhook-trigger', durationMs: 110, status: 'SUCCESS' },
        { nodeId: 'node-2', nodeType: 'meta-create-campaign', durationMs: 400, status: 'FAILED', errorMessage: 'OAuth Scope Permission Mismatch' },
      ];
    }
    throw new NotFoundException(`Execution run ${executionId} not found.`);
  }

  @Post('executions/:id/replay')
  @HttpCode(HttpStatus.ACCEPTED)
  async replayExecution(@Param('id') executionId: string) {
    // Standard execution pipeline: enqueues a new BullMQ execution run job
    const newCorrelationId = `replay-${executionId}-${Date.now()}`;
    
    await this.queue.add('execute-workflow', {
      workflowId: 'wf-99',
      executionId: `run-replay-${Date.now()}`,
      correlationId: newCorrelationId,
      nodes: [
        { id: 'node-1', type: 'webhook-trigger', properties: {} },
      ],
      edges: [],
      variables: {
        trigger: {
          payload: { source: 'replay', originalExecutionId: executionId },
        },
      },
    });

    return {
      success: true,
      correlationId: newCorrelationId,
      message: 'Workflow replay job enqueued successfully.',
    };
  }
}
