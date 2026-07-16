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
exports.WorkflowCompilerService = void 0;
const common_1 = require("@nestjs/common");
const crypto_1 = require("crypto");
let WorkflowCompilerService = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var WorkflowCompilerService = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            WorkflowCompilerService = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        async compile(canvasJson) {
            const nodes = canvasJson?.nodes || [];
            const edges = canvasJson?.edges || [];
            const triggerNode = nodes.find((n) => n.type === 'Trigger');
            const triggerType = triggerNode?.data?.triggerType || 'MANUAL';
            const inDegree = new Map();
            const adj = new Map();
            for (const node of nodes) {
                inDegree.set(node.id, 0);
                adj.set(node.id, []);
            }
            for (const edge of edges) {
                if (adj.has(edge.source)) {
                    adj.get(edge.source).push(edge.target);
                }
                if (inDegree.has(edge.target)) {
                    inDegree.set(edge.target, inDegree.get(edge.target) + 1);
                }
            }
            const queue = [];
            inDegree.forEach((degree, nodeId) => {
                if (degree === 0) {
                    queue.push(nodeId);
                }
            });
            const orderedNodeIds = [];
            while (queue.length > 0) {
                const u = queue.shift();
                orderedNodeIds.push(u);
                const neighbors = adj.get(u) || [];
                for (const v of neighbors) {
                    inDegree.set(v, inDegree.get(v) - 1);
                    if (inDegree.get(v) === 0) {
                        queue.push(v);
                    }
                }
            }
            const actions = [];
            const conditions = [];
            for (const id of orderedNodeIds) {
                const node = nodes.find((n) => n.id === id);
                if (!node)
                    continue;
                if (node.type === 'Action') {
                    actions.push({
                        actionId: node.id,
                        executorName: node.data?.executorName || 'unknown',
                        parameters: node.data?.parameters || {},
                    });
                }
                else if (node.type === 'Condition') {
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
            const checksum = (0, crypto_1.createHash)('sha256')
                .update(JSON.stringify(definitionJson))
                .digest('hex');
            return {
                definitionJson,
                checksum,
            };
        }
    };
    return WorkflowCompilerService = _classThis;
})();
exports.WorkflowCompilerService = WorkflowCompilerService;
//# sourceMappingURL=workflow-compiler.service.js.map