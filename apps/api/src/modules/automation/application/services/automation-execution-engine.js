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
exports.AutomationExecutionEngine = void 0;
const common_1 = require("@nestjs/common");
const crypto_1 = require("crypto");
let AutomationExecutionEngine = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var AutomationExecutionEngine = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            AutomationExecutionEngine = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        ruleRepo;
        evaluator;
        dispatcher;
        eventBus;
        resolver;
        prisma;
        hooks;
        constructor(ruleRepo, evaluator, dispatcher, eventBus, resolver, prisma, hooks = []) {
            this.ruleRepo = ruleRepo;
            this.evaluator = evaluator;
            this.dispatcher = dispatcher;
            this.eventBus = eventBus;
            this.resolver = resolver;
            this.prisma = prisma;
            this.hooks = hooks;
        }
        onModuleInit() {
            this.eventBus.subscribe('*', this.handleEvent.bind(this));
        }
        async executeRuleManually(ruleId, workspaceId, payload, userId, dryRun = false) {
            const rule = await this.ruleRepo.findRuleById(ruleId, workspaceId);
            if (!rule || rule.status === 'ARCHIVED') {
                throw new Error('Active rule not found or archived.');
            }
            const latestVersion = rule.versions[0];
            if (!latestVersion) {
                throw new Error('No rule version available.');
            }
            const event = {
                id: (0, crypto_1.randomUUID)(),
                name: 'Manual',
                workspaceId,
                payload: {
                    entityId: payload.entityId || 'manual',
                    ...payload,
                },
                triggerVersion: '1.0',
                source: 'Manual',
                correlationId: (0, crypto_1.randomUUID)(),
                causationId: (0, crypto_1.randomUUID)(),
                occurredAt: new Date(),
                receivedAt: new Date(),
                processedAt: new Date(),
                timestamp: new Date(),
            };
            return await this.evaluateAndExecute(rule, latestVersion, event, dryRun, userId);
        }
        async handleEvent(event) {
            const matchingRules = await this.resolver.resolveMatchingRules(event);
            for (const rule of matchingRules) {
                const activeVersion = rule.versions[0];
                if (activeVersion) {
                    await this.evaluateAndExecute(rule, activeVersion, event, false, activeVersion.createdBy);
                }
            }
        }
        async evaluateAndExecute(rule, version, event, dryRun, userId) {
            const correlationId = (0, crypto_1.randomUUID)();
            const entityId = event.payload.entityId || 'workspace';
            const idempotencyKey = `${version.id}:${event.id}:${entityId}`;
            const existingAuditLog = await this.prisma.automationAuditLog.findUnique({
                where: { idempotencyKey },
            });
            if (existingAuditLog) {
                return { status: 'SKIPPED', reason: 'Idempotency key duplicate' };
            }
            const startTime = Date.now();
            let executionStatus = dryRun ? 'DRY_RUN' : 'PROCESSING';
            let triggerEvaluated = true;
            let conditionsMatched = false;
            const actionsTaken = [];
            let errorMessage = null;
            let explainability = {};
            const context = await this.prisma.automationExecutionContext.create({
                data: {
                    ruleId: rule.id,
                    versionId: version.id,
                    triggerType: event.name,
                    triggerEvent: event.payload,
                    correlationId,
                    matchedEntities: { entityId },
                    startedAt: new Date(),
                },
            });
            await this.publishEvent('Trigger Matched', event.workspaceId, correlationId, event.id, {
                ruleId: rule.id,
                versionId: version.id,
                triggerType: event.name,
            });
            try {
                for (const hook of this.hooks) {
                    await hook.beforeEvaluate(context);
                }
                const ast = version.ast;
                const conditionNode = ast.conditionNode;
                conditionsMatched = this.evaluator.evaluate(conditionNode, event.payload);
                explainability = {
                    ruleId: rule.id,
                    version: version.version,
                    trigger: event.name,
                    payloadEvaluated: event.payload,
                    conditionsMatched,
                    conditionTreeSnapshot: conditionNode,
                };
                await this.publishEvent('Rule Evaluated', event.workspaceId, correlationId, context.id, {
                    ruleId: rule.id,
                    versionId: version.id,
                    conditionsMatched,
                    explainability,
                });
                if (conditionsMatched) {
                    const actions = version.actions;
                    for (const hook of this.hooks) {
                        for (const action of actions) {
                            await hook.beforeDispatch(context, action);
                        }
                    }
                    const executionPromise = (async () => {
                        for (const action of actions) {
                            const dispatchStart = Date.now();
                            let actionResult;
                            try {
                                actionResult = await this.dispatcher.dispatch(action, event.workspaceId, userId, dryRun);
                                actionsTaken.push({
                                    actionType: action.type,
                                    params: action.params,
                                    status: 'SUCCESS',
                                    result: actionResult,
                                    durationMs: Date.now() - dispatchStart,
                                });
                            }
                            catch (err) {
                                actionsTaken.push({
                                    actionType: action.type,
                                    params: action.params,
                                    status: 'FAILED',
                                    error: err.message,
                                    durationMs: Date.now() - dispatchStart,
                                });
                                throw err;
                            }
                            for (const hook of this.hooks) {
                                await hook.afterDispatch(context, action, actionResult);
                            }
                        }
                    })();
                    const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error('Execution Timeout')), 10000));
                    await Promise.race([executionPromise, timeoutPromise]);
                    executionStatus = dryRun ? 'DRY_RUN' : 'SUCCESS';
                }
                else {
                    executionStatus = 'NO_MATCH';
                }
                for (const hook of this.hooks) {
                    await hook.afterComplete(context, { executionStatus, actionsTaken });
                }
            }
            catch (err) {
                if (err.message === 'Execution Timeout') {
                    executionStatus = 'TIMEOUT';
                }
                else {
                    executionStatus = 'FAILED';
                }
                errorMessage = err.message;
                for (const hook of this.hooks) {
                    await hook.afterFailure(context, err);
                }
            }
            finally {
                const durationMs = Date.now() - startTime;
                await this.prisma.automationExecutionContext.update({
                    where: { id: context.id },
                    data: { finishedAt: new Date() },
                });
                await this.prisma.automationAuditLog.create({
                    data: {
                        ruleId: rule.id,
                        versionId: version.id,
                        workspaceId: event.workspaceId,
                        contextId: context.id,
                        idempotencyKey,
                        executionStatus,
                        triggerEvaluated,
                        conditionsMatched,
                        actionsTaken: actionsTaken,
                        errorMessage,
                        ruleSnapshot: version.ast,
                        explainability: explainability,
                        durationMs,
                    },
                });
                await this.publishEvent('Execution Completed', event.workspaceId, correlationId, context.id, {
                    ruleId: rule.id,
                    versionId: version.id,
                    status: executionStatus,
                    durationMs,
                    actionsTaken,
                });
            }
            return {
                correlationId,
                executionStatus,
                conditionsMatched,
                actionsTaken,
                errorMessage,
                explainability,
                durationMs: Date.now() - startTime,
            };
        }
        async publishEvent(name, workspaceId, correlationId, causationId, payload) {
            const event = {
                id: (0, crypto_1.randomUUID)(),
                name,
                workspaceId,
                payload,
                triggerVersion: '1.0',
                source: 'Execution Engine',
                correlationId,
                causationId,
                occurredAt: new Date(),
                receivedAt: new Date(),
                processedAt: new Date(),
                timestamp: new Date(),
            };
            await this.eventBus.publish(event);
        }
    };
    return AutomationExecutionEngine = _classThis;
})();
exports.AutomationExecutionEngine = AutomationExecutionEngine;
//# sourceMappingURL=automation-execution-engine.js.map