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
exports.AutomationValidationService = void 0;
const common_1 = require("@nestjs/common");
let AutomationValidationService = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var AutomationValidationService = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            AutomationValidationService = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        triggerValidators;
        conditionValidators;
        actionValidators;
        constructor(triggerValidators = [], conditionValidators = [], actionValidators = []) {
            this.triggerValidators = triggerValidators;
            this.conditionValidators = conditionValidators;
            this.actionValidators = actionValidators;
        }
        validateAndCompile(trigger, conditions, actions, schemaVersion) {
            if (!trigger || !trigger.type) {
                throw new common_1.BadRequestException('Trigger type must be defined.');
            }
            if (!actions || !Array.isArray(actions) || actions.length === 0) {
                throw new common_1.BadRequestException('At least one action must be defined.');
            }
            // 1. Validate Trigger
            const tVal = this.triggerValidators.find((v) => v.supports(trigger.type));
            if (tVal) {
                tVal.validate(trigger);
            }
            else {
                this.defaultValidateTrigger(trigger);
            }
            // 2. Validate Conditions
            if (conditions) {
                this.validateConditions(conditions);
            }
            // 3. Validate Actions
            for (const action of actions) {
                if (!action.type) {
                    throw new common_1.BadRequestException('Action type must be defined.');
                }
                const aVal = this.actionValidators.find((v) => v.supports(action.type));
                if (aVal) {
                    aVal.validate(action);
                }
                else {
                    this.defaultValidateAction(action);
                }
            }
            // 4. Circular Dependency Guard
            this.detectCircularDependencies(trigger, actions);
            // 5. Compile to internal AST representation
            const ast = this.compileToAST(trigger, conditions, actions, schemaVersion);
            return { ast };
        }
        defaultValidateTrigger(trigger) {
            const supportedTriggers = [
                'Manual',
                'Schedule',
                'Campaign Published',
                'Campaign Paused',
                'Campaign Archived',
                'AdSet Published',
                'Ad Published',
                'Webhook Received',
                'Insights Synced',
                'Status Changed',
            ];
            if (!supportedTriggers.includes(trigger.type)) {
                throw new common_1.BadRequestException(`Unsupported trigger type: ${trigger.type}`);
            }
        }
        validateConditions(conditions) {
            const supportedConditions = [
                'Status',
                'Spend',
                'CTR',
                'CPC',
                'CPM',
                'ROAS',
                'Frequency',
                'Reach',
                'Budget',
                'Time',
                'Custom Expression Placeholder',
            ];
            if (conditions.type && supportedConditions.includes(conditions.type)) {
                const cVal = this.conditionValidators.find((v) => v.supports(conditions.type));
                if (cVal)
                    cVal.validate(conditions);
                return;
            }
            if (conditions.operator === 'AND' || conditions.operator === 'OR') {
                if (!Array.isArray(conditions.children)) {
                    throw new common_1.BadRequestException('Logical operator condition must contain children array.');
                }
                for (const child of conditions.children) {
                    this.validateConditions(child);
                }
                return;
            }
            throw new common_1.BadRequestException(`Invalid condition structure or unsupported type.`);
        }
        defaultValidateAction(action) {
            const supportedActions = [
                'Pause Campaign',
                'Resume Campaign',
                'Pause AdSet',
                'Resume AdSet',
                'Pause Ad',
                'Resume Ad',
                'Send Notification',
                'Call Webhook',
                'Future AI Action Placeholder',
            ];
            if (!supportedActions.includes(action.type)) {
                throw new common_1.BadRequestException(`Unsupported action type: ${action.type}`);
            }
        }
        detectCircularDependencies(trigger, actions) {
            // Check for self-trigger loops
            // e.g. Trigger on status changed and Action is modifying/resuming the same object type
            for (const action of actions) {
                if (trigger.type === 'Campaign Paused' && action.type === 'Pause Campaign') {
                    throw new common_1.BadRequestException('Circular loop detected: trigger Campaign Paused calls Pause Campaign.');
                }
                if (trigger.type === 'Status Changed' && (action.type === 'Pause Campaign' || action.type === 'Resume Campaign')) {
                    throw new common_1.BadRequestException('Circular loop warning: status change trigger modifying same status property.');
                }
            }
        }
        compileToAST(trigger, conditions, actions, schemaVersion) {
            return {
                schemaVersion,
                compiledAt: new Date().toISOString(),
                triggerNode: {
                    kind: 'TRIGGER',
                    type: trigger.type,
                    params: trigger.params || {},
                },
                conditionNode: this.compileConditionNode(conditions),
                actionNodes: actions.map((act) => ({
                    kind: 'ACTION',
                    type: act.type,
                    params: act.params || {},
                })),
            };
        }
        compileConditionNode(conditions) {
            if (!conditions)
                return null;
            if (conditions.operator) {
                return {
                    kind: 'LOGICAL_EXPRESSION',
                    operator: conditions.operator,
                    expressions: conditions.children.map((c) => this.compileConditionNode(c)),
                };
            }
            return {
                kind: 'COMPARISON_EXPRESSION',
                field: conditions.field || conditions.type,
                operator: conditions.operator || '==',
                value: conditions.value,
            };
        }
    };
    return AutomationValidationService = _classThis;
})();
exports.AutomationValidationService = AutomationValidationService;
//# sourceMappingURL=automation-validation.service.js.map