"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkflowSerializer = void 0;
class WorkflowSerializer {
    static serialize(nodes, edges) {
        return JSON.stringify({ nodes, edges });
    }
    static deserialize(json) {
        const data = JSON.parse(json);
        if (!data.nodes || !data.edges) {
            throw new Error("Invalid serialized workflow JSON configuration.");
        }
        return {
            nodes: data.nodes,
            edges: data.edges,
        };
    }
    static exportTemplate(name, nodes, edges) {
        const payload = {
            templateName: name,
            exportedAt: new Date().toISOString(),
            schemaVersion: "1.0.0",
            graph: { nodes, edges },
        };
        return JSON.stringify(payload, null, 2);
    }
    static importTemplate(json) {
        const data = JSON.parse(json);
        if (!data.templateName || !data.graph?.nodes || !data.graph?.edges) {
            throw new Error("Invalid template import file schema.");
        }
        return {
            name: data.templateName,
            nodes: data.graph.nodes,
            edges: data.graph.edges,
        };
    }
    static computeDiff(v1, v2) {
        const addedNodes = v2.nodes.filter((n2) => !v1.nodes.some((n1) => n1.id === n2.id));
        const removedNodes = v1.nodes.filter((n1) => !v2.nodes.some((n2) => n2.id === n1.id));
        return {
            addedNodesCount: addedNodes.length,
            removedNodesCount: removedNodes.length,
            isIdentical: addedNodes.length === 0 && removedNodes.length === 0,
        };
    }
}
exports.WorkflowSerializer = WorkflowSerializer;
//# sourceMappingURL=serializer.js.map