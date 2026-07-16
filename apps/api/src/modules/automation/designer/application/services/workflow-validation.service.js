"use strict";
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkflowValidationService = void 0;
const common_1 = require("@nestjs/common");
let WorkflowValidationService = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var WorkflowValidationService = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            WorkflowValidationService = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        nodeRegistry;
        constructor(nodeRegistry) {
            this.nodeRegistry = nodeRegistry;
        }
        async validate(canvasJson) {
            const nodes = canvasJson?.nodes || [];
            const edges = canvasJson?.edges || [];
            const issues = [];
            if (nodes.length > 100) {
                issues.push({ severity: 'ERROR', message: 'Workflow exceeds maximum node limit (100).' });
            }
            if (edges.length > 150) {
                issues.push({ severity: 'ERROR', message: 'Workflow exceeds maximum edge limit (150).' });
            }
            const triggers = nodes.filter((n) => n.type === 'Trigger');
            if (triggers.length === 0) {
                issues.push({ severity: 'ERROR', message: 'Workflow must contain at least one root Trigger node.' });
            }
            else if (triggers.length > 1) {
                issues.push({ severity: 'ERROR', message: 'Workflow contains multiple root Trigger nodes (only one allowed).' });
            }
            const adj = new Map();
            for (const node of nodes) {
                adj.set(node.id, []);
            }
            for (const edge of edges) {
                if (adj.has(edge.source)) {
                    adj.get(edge.source).push(edge.target);
                }
            }
            const visited = new Set();
            const recStack = new Set();
            let hasCycle = false;
            const dfs = (nodeId) => {
                visited.add(nodeId);
                recStack.add(nodeId);
                const neighbors = adj.get(nodeId) || [];
                for (const neighbor of neighbors) {
                    if (!visited.has(neighbor)) {
                        if (dfs(neighbor))
                            return true;
                    }
                    else if (recStack.has(neighbor)) {
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
                const inputsCount = edges.filter((e) => e.target === node.id).length;
                const outputsCount = edges.filter((e) => e.source === node.id).length;
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
    };
    return WorkflowValidationService = _classThis;
})();
exports.WorkflowValidationService = WorkflowValidationService;
//# sourceMappingURL=workflow-validation.service.js.map