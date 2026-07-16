"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
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
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.SchedulerLoop = void 0;
const common_1 = require("@nestjs/common");
const crypto_1 = require("crypto");
const os = __importStar(require("os"));
let SchedulerLoop = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var SchedulerLoop = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            SchedulerLoop = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        engine;
        prisma;
        nodeId = `node-${(0, crypto_1.randomUUID)()}`;
        heartbeatTimer;
        pollTimer;
        isShuttingDown = false;
        constructor(engine, prisma) {
            this.engine = engine;
            this.prisma = prisma;
        }
        async onApplicationBootstrap() {
            this.isShuttingDown = false;
            await this.prisma.automationSchedulerNode.create({
                data: {
                    id: this.nodeId,
                    hostname: os.hostname(),
                    processId: process.pid,
                    heartbeatAt: new Date(),
                    version: '1.0.0',
                    status: 'ACTIVE',
                },
            });
            this.heartbeatTimer = setInterval(() => this.sendHeartbeat(), 10000);
            this.pollTimer = setInterval(() => this.pollSchedules(), 5000);
        }
        async onApplicationShutdown() {
            this.isShuttingDown = true;
            if (this.heartbeatTimer)
                clearInterval(this.heartbeatTimer);
            if (this.pollTimer)
                clearInterval(this.pollTimer);
            try {
                await this.prisma.automationSchedulerNode.update({
                    where: { id: this.nodeId },
                    data: { status: 'INACTIVE', heartbeatAt: new Date() },
                });
            }
            catch {
                // Ignored during shutdown bounds
            }
        }
        async sendHeartbeat() {
            if (this.isShuttingDown)
                return;
            try {
                await this.prisma.automationSchedulerNode.update({
                    where: { id: this.nodeId },
                    data: { heartbeatAt: new Date() },
                });
            }
            catch {
                // Heartbeat resilient update retry
            }
        }
        async pollSchedules() {
            if (this.isShuttingDown)
                return;
            const now = new Date();
            try {
                const dueSchedules = await this.prisma.automationSchedule.findMany({
                    where: {
                        status: 'ACTIVE',
                        nextRunAtUtc: { lte: now },
                    },
                });
                for (const schedule of dueSchedules) {
                    this.engine.triggerSchedule(schedule.id, this.nodeId).catch(() => {
                        // Silent catch since execution state is already persisted
                    });
                }
            }
            catch {
                // Prevents DB connection failure from blocking the loop node
            }
        }
        getNodeId() {
            return this.nodeId;
        }
    };
    return SchedulerLoop = _classThis;
})();
exports.SchedulerLoop = SchedulerLoop;
//# sourceMappingURL=scheduler-loop.service.js.map