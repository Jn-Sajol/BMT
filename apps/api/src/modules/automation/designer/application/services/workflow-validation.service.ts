import { Injectable } from '@nestjs/common';
import { IWorkflowValidator, ValidationIssue } from '../../domain/ports/workflow-validator.interface';
import { WorkflowNodeRegistry } from '../../infrastructure/registries/node-registry';

@Injectable()
export class WorkflowValidationService implements IWorkflowValidator {
  constructor(private readonly nodeRegistry: WorkflowNodeRegistry) {}

  async validate(canvasJson: any): Promise<{ isValid: boolean; issues: ValidationIssue[] }> {
    const nodes = canvasJson?.nodes || [];
    const edges = canvasJson?.edges || [];
    const issues: ValidationIssue[] = [];

    if (nodes.length > 100) {
      issues.push({ severity: 'ERROR', message: 'Workflow exceeds maximum node limit (100).' });
    }
    if (edges.length > 150) {
      issues.push({ severity: 'ERROR', message: 'Workflow exceeds maximum edge limit (150).' });
    }

    const triggers = nodes.filter((n: any) => n.type === 'Trigger');
    if (triggers.length === 0) {
      issues.push({ severity: 'ERROR', message: 'Workflow must contain at least one root Trigger node.' });
    } else if (triggers.length > 1) {
      issues.push({ severity: 'ERROR', message: 'Workflow contains multiple root Trigger nodes (only one allowed).' });
    }

    const adj = new Map<string, string[]>();
    for (const node of nodes) {
      adj.set(node.id, []);
    }
    for (const edge of edges) {
      if (adj.has(edge.source)) {
        adj.get(edge.source)!.push(edge.target);
      }
    }

    const visited = new Set<string>();
    const recStack = new Set<string>();
    let hasCycle = false;

    const dfs = (nodeId: string): boolean => {
      visited.add(nodeId);
      recStack.add(nodeId);

      const neighbors = adj.get(nodeId) || [];
      for (const neighbor of neighbors) {
        if (!visited.has(neighbor)) {
          if (dfs(neighbor)) return true;
        } else if (recStack.has(neighbor)) {
          return true;
        }
      }

      recStack.delete(nodeId);
      return false;
    };

    for (const node of nodes) {
      if (!visited.has(node.id)) {
        if (dfs(node.id)) {
          hasCycle = true;
          break;
        }
      }
    }

    if (hasCycle) {
      issues.push({ severity: 'ERROR', message: 'Workflow contains cyclical loops (infinite cycles blocked).' });
    }

    for (const node of nodes) {
      const reg = this.nodeRegistry.getNode(node.type);
      if (!reg) {
        issues.push({ nodeId: node.id, severity: 'ERROR', message: `Unknown node type: ${node.type}` });
        continue;
      }

      const inputsCount = edges.filter((e: any) => e.target === node.id).length;
      const outputsCount = edges.filter((e: any) => e.source === node.id).length;

      if (reg.allowedInputsCount === 0 && inputsCount > 0) {
        issues.push({ nodeId: node.id, severity: 'ERROR', message: `${node.type} cannot accept input connections.` });
      }
      if (reg.allowedOutputsCount === 0 && outputsCount > 0) {
        issues.push({ nodeId: node.id, severity: 'ERROR', message: `${node.type} cannot yield output connections.` });
      }
    }

    return {
      isValid: !issues.some((i) => i.severity === 'ERROR'),
      issues,
    };
  }
}
