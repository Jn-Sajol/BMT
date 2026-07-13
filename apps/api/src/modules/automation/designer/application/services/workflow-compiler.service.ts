import { Injectable } from '@nestjs/common';
import { IWorkflowCompiler } from '../../domain/ports/workflow-compiler.interface';
import { createHash } from 'crypto';

@Injectable()
export class WorkflowCompilerService implements IWorkflowCompiler {
  async compile(canvasJson: any): Promise<{ definitionJson: any; checksum: string }> {
    const nodes = canvasJson?.nodes || [];
    const edges = canvasJson?.edges || [];

    const triggerNode = nodes.find((n: any) => n.type === 'Trigger');
    const triggerType = triggerNode?.data?.triggerType || 'MANUAL';

    const inDegree = new Map<string, number>();
    const adj = new Map<string, string[]>();

    for (const node of nodes) {
      inDegree.set(node.id, 0);
      adj.set(node.id, []);
    }

    for (const edge of edges) {
      if (adj.has(edge.source)) {
        adj.get(edge.source)!.push(edge.target);
      }
      if (inDegree.has(edge.target)) {
        inDegree.set(edge.target, inDegree.get(edge.target)! + 1);
      }
    }

    const queue: string[] = [];
    inDegree.forEach((degree, nodeId) => {
      if (degree === 0) {
        queue.push(nodeId);
      }
    });

    const orderedNodeIds: string[] = [];
    while (queue.length > 0) {
      const u = queue.shift()!;
      orderedNodeIds.push(u);

      const neighbors = adj.get(u) || [];
      for (const v of neighbors) {
        inDegree.set(v, inDegree.get(v)! - 1);
        if (inDegree.get(v) === 0) {
          queue.push(v);
        }
      }
    }

    const actions: any[] = [];
    const conditions: any[] = [];

    for (const id of orderedNodeIds) {
      const node = nodes.find((n: any) => n.id === id);
      if (!node) continue;

      if (node.type === 'Action') {
        actions.push({
          actionId: node.id,
          executorName: node.data?.executorName || 'unknown',
          parameters: node.data?.parameters || {},
        });
      } else if (node.type === 'Condition') {
        conditions.push({
          conditionId: node.id,
          property: node.data?.property || '',
          operator: node.data?.operator || '',
          value: node.data?.value || '',
        });
      }
    }

    const definitionJson = {
      trigger: {
        triggerType,
        version: '1.0',
      },
      conditions,
      actions,
      metadata: {
        compiledAt: new Date().toISOString(),
        nodeCount: nodes.length,
      },
    };

    const checksum = createHash('sha256')
      .update(JSON.stringify(definitionJson))
      .digest('hex');

    return {
      definitionJson,
      checksum,
    };
  }
}
