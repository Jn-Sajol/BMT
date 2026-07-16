"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkflowValidator = void 0;
const node_type_registry_1 = require("../../domain/registries/node-type.registry");
class WorkflowValidator {
    static validate(nodes, edges) {
        const errors = [];
        // 1. Root Trigger Validation
        const triggers = nodes.filter((n) => n.type === "TRIGGER");
        if (triggers.length === 0) {
            errors.push({ type: "MISSING_TRIGGER", message: "Workflow must have at least one TRIGGER node." });
        }
        // Ensure triggers have no incoming edges
        triggers.forEach((trigger) => {
            const incoming = edges.some((e) => e.target === trigger.id);
            if (incoming) {
                errors.push({
                    type: "INVALID_TRIGGER_CONNECTION",
                    message: `Trigger node ${trigger.id} cannot have incoming connections.`,
                    nodeId: trigger.id,
                });
            }
        });
        // 2. Invalid Node Detection
        nodes.forEach((node) => {
            if (!node_type_registry_1.NodeTypeRegistry.isSupported(node.type)) {
                errors.push({
                    type: "UNSUPPORTED_NODE_TYPE",
                    message: `Node ${node.id} has unsupported type: ${node.type}`,
                    nodeId: node.id,
                });
            }
        });
        // 3. Invalid Connection & Duplicate Edge Detection
        const seenEdges = new Set();
        edges.forEach((edge) => {
            // Self loop check
            if (edge.source === edge.target) {
                errors.push({
                    type: "SELF_LOOP",
                    message: `Edge ${edge.id} connects a node to itself.`,
                    edgeId: edge.id,
                });
            }
            // Duplicate edge check
            const pairKey = `${edge.source}->${edge.target}`;
            if (seenEdges.has(pairKey)) {
                errors.push({
                    type: "DUPLICATE_EDGE",
                    message: `Duplicate connection found between ${edge.source} and ${edge.target}.`,
                    edgeId: edge.id,
                });
            }
            seenEdges.add(pairKey);
            // Incompatible connection check (e.g. source/target not found)
            const sourceExists = nodes.some((n) => n.id === edge.source);
            const targetExists = nodes.some((n) => n.id === edge.target);
            if (!sourceExists || !targetExists) {
                errors.push({
                    type: "INVALID_CONNECTION",
                    message: `Edge ${edge.id} references non-existent nodes.`,
                    edgeId: edge.id,
                });
            }
        });
        // 4. Orphan Detection (excluding triggers when they are lone nodes, but generally nodes must connect)
        if (nodes.length > 1) {
            nodes.forEach((node) => {
                const isConnected = edges.some((e) => e.source === node.id || e.target === node.id);
                if (!isConnected) {
                    errors.push({
                        type: "ORPHAN_NODE",
                        message: `Node ${node.id} is not connected to any other node.`,
                        nodeId: node.id,
                    });
                }
            });
        }
        // 5. Cycle Detection using Kahn's Algorithm
        if (errors.length === 0) {
            const hasCycle = WorkflowValidator.detectCycleKahn(nodes, edges);
            if (hasCycle) {
                errors.push({ type: "CYCLIC_DEPENDENCY", message: "Workflow contains a circular dependency." });
            }
        }
        return errors;
    }
    static detectCycleKahn(nodes, edges) {
        const inDegree = {};
        const adjList = {};
        // Initialize
        nodes.forEach((n) => {
            inDegree[n.id] = 0;
            adjList[n.id] = [];
        });
        // Populate adjacency and in-degree tables
        edges.forEach((e) => {
            if (adjList[e.source] && inDegree[e.target] !== undefined) {
                adjList[e.source].push(e.target);
                inDegree[e.target]++;
            }
        });
        // Load nodes with in-degree 0 into queue
        const queue = [];
        nodes.forEach((n) => {
            if (inDegree[n.id] === 0) {
                queue.push(n.id);
            }
        });
        let processedCount = 0;
        while (queue.length > 0) {
            const curr = queue.shift();
            processedCount++;
            const neighbors = adjList[curr] || [];
            neighbors.forEach((neighbor) => {
                inDegree[neighbor]--;
                if (inDegree[neighbor] === 0) {
                    queue.push(neighbor);
                }
            });
        }
        // If processed elements count != total nodes count, a cycle exists
        return processedCount !== nodes.length;
    }
}
exports.WorkflowValidator = WorkflowValidator;
//# sourceMappingURL=validator.js.map