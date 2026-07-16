"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkflowAggregate = void 0;
class WorkflowAggregate {
    id;
    name;
    workspaceId;
    nodes;
    edges;
    constructor(id, name, workspaceId, nodes = [], edges = []) {
        this.id = id;
        this.name = name;
        this.workspaceId = workspaceId;
        this.nodes = nodes;
        this.edges = edges;
    }
    addNode(node) {
        if (this.nodes.some((n) => n.id === node.id)) {
            throw new Error(`Node with ID ${node.id} already exists in workflow.`);
        }
        this.nodes.push(node);
    }
    removeNode(nodeId) {
        this.nodes = this.nodes.filter((n) => n.id !== nodeId);
        this.edges = this.edges.filter((e) => e.source !== nodeId && e.target !== nodeId);
    }
    addEdge(edge) {
        if (this.edges.some((e) => e.id === edge.id)) {
            throw new Error(`Edge with ID ${edge.id} already exists in workflow.`);
        }
        // Verify source and target exist
        if (!this.nodes.some((n) => n.id === edge.source) || !this.nodes.some((n) => n.id === edge.target)) {
            throw new Error("Edge source and target nodes must exist in the workflow.");
        }
        this.edges.push(edge);
    }
    removeEdge(edgeId) {
        this.edges = this.edges.filter((e) => e.id !== edgeId);
    }
}
exports.WorkflowAggregate = WorkflowAggregate;
//# sourceMappingURL=workflow.model.js.map