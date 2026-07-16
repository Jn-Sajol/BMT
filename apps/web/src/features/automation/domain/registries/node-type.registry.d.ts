import { WorkflowNodeType } from "../types";
export declare const NodeTypeRegistry: {
    supportedTypes: Set<WorkflowNodeType>;
    isSupported: (type: string) => boolean;
};
