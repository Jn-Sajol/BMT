export interface NodeMetadata {
    type: string;
    category: 'TRIGGER' | 'CONDITION' | 'ACTION' | 'CONTROL';
    allowedInputsCount: number;
    allowedOutputsCount: number;
    description: string;
}
export declare class WorkflowNodeRegistry {
    private registry;
    constructor();
    register(node: NodeMetadata): void;
    getNode(type: string): NodeMetadata | undefined;
}
