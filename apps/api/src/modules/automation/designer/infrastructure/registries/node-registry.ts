import { Injectable } from '@nestjs/common';

export interface NodeMetadata {
  type: string;
  category: 'TRIGGER' | 'CONDITION' | 'ACTION' | 'CONTROL';
  allowedInputsCount: number;
  allowedOutputsCount: number;
  description: string;
}

@Injectable()
export class WorkflowNodeRegistry {
  private registry = new Map<string, NodeMetadata>();

  constructor() {
    this.register({
      type: 'Trigger',
      category: 'TRIGGER',
      allowedInputsCount: 0,
      allowedOutputsCount: 1,
      description: 'Starting point of an automation workflow trigger.',
    });
    this.register({
      type: 'Condition',
      category: 'CONDITION',
      allowedInputsCount: 1,
      allowedOutputsCount: 2,
      description: 'Conditional evaluations path router.',
    });
    this.register({
      type: 'Action',
      category: 'ACTION',
      allowedInputsCount: 1,
      allowedOutputsCount: 1,
      description: 'Executes automation lifecycle domain action.',
    });
    this.register({
      type: 'Wait',
      category: 'CONTROL',
      allowedInputsCount: 1,
      allowedOutputsCount: 1,
      description: 'Inserts deliberate execution delays.',
    });
  }

  register(node: NodeMetadata): void {
    this.registry.set(node.type.toUpperCase(), node);
  }

  getNode(type: string): NodeMetadata | undefined {
    return this.registry.get(type.toUpperCase());
  }
}
