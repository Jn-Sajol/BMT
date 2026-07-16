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
exports.AutomationEvaluator = void 0;
const common_1 = require("@nestjs/common");
let AutomationEvaluator = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var AutomationEvaluator = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            AutomationEvaluator = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        evaluate(conditionNode, payload) {
            if (!conditionNode) {
                return true;
            }
            if (conditionNode.kind === 'LOGICAL_EXPRESSION') {
                const operator = conditionNode.operator;
                const expressions = conditionNode.expressions || [];
                if (operator === 'AND') {
                    for (const exp of expressions) {
                        if (!this.evaluate(exp, payload)) {
                            return false;
                        }
                    }
                    return true;
                }
                else if (operator === 'OR') {
                    for (const exp of expressions) {
                        if (this.evaluate(exp, payload)) {
                            return true;
                        }
                    }
                    return false;
                }
                throw new common_1.BadRequestException(`Unsupported logical operator: ${operator}`);
            }
            if (conditionNode.kind === 'COMPARISON_EXPRESSION') {
                const field = conditionNode.field;
                const operator = conditionNode.operator;
                const targetValue = conditionNode.value;
                const actualValue = payload[field];
                if (actualValue === undefined) {
                    return false;
                }
                switch (operator) {
                    case '==':
                    case 'EQUALS':
                        return actualValue === targetValue;
                    case '!=':
                    case 'NOT_EQUALS':
                        return actualValue !== targetValue;
                    case '>':
                    case 'GREATER_THAN':
                        return Number(actualValue) > Number(targetValue);
                    case '>=':
                    case 'GREATER_THAN_OR_EQUAL':
                        return Number(actualValue) >= Number(targetValue);
                    case '<':
                    case 'LESS_THAN':
                        return Number(actualValue) < Number(targetValue);
                    case '<=':
                    case 'LESS_THAN_OR_EQUAL':
                        return Number(actualValue) <= Number(targetValue);
                    default:
                        throw new common_1.BadRequestException(`Unsupported comparison operator: ${operator}`);
                }
            }
            throw new common_1.BadRequestException(`Unknown AST condition node kind: ${conditionNode.kind}`);
        }
    };
    return AutomationEvaluator = _classThis;
})();
exports.AutomationEvaluator = AutomationEvaluator;
//# sourceMappingURL=automation-evaluator.service.js.map