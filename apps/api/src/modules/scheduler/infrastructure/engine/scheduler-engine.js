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
exports.SchedulerEngine = void 0;
const common_1 = require("@nestjs/common");
const crypto = __importStar(require("crypto"));
let SchedulerEngine = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var SchedulerEngine = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            SchedulerEngine = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        jobRepo;
        clockProvider;
        workers;
        intervalId = null;
        instanceId = crypto.randomUUID();
        constructor(jobRepo, clockProvider, workers = []) {
            this.jobRepo = jobRepo;
            this.clockProvider = clockProvider;
            this.workers = workers;
        }
        onModuleInit() {
            this.start();
        }
        onModuleDestroy() {
            this.stop();
        }
        start() {
            if (this.intervalId)
                return;
            this.intervalId = setInterval(() => this.tick(), 5000);
        }
        stop() {
            if (this.intervalId) {
                clearInterval(this.intervalId);
                this.intervalId = null;
            }
        }
        async tick() {
            const lockKey = 'scheduler_engine_lock';
            const acquired = await this.jobRepo.acquireLock(lockKey, this.instanceId, 10);
            if (!acquired) {
                return;
            }
            try {
                const now = this.clockProvider.now();
                const pendingJobs = await this.jobRepo.findPendingJobs(now);
                for (const job of pendingJobs) {
                    await this.runJob(job);
                }
            }
            catch (e) {
                // Log tick error
            }
            finally {
                await this.jobRepo.releaseLock(lockKey, this.instanceId);
            }
        }
        async runJob(job) {
            const startedAt = this.clockProvider.now();
            const attempt = job.attempts + 1;
            try {
                await this.jobRepo.updateJobStatus(job.id, 'RUNNING', attempt, null, job.runAt, startedAt);
                const targetWorkers = this.workers.filter((w) => w.supports(job.name, job.provider));
                if (targetWorkers.length === 0) {
                    throw new Error(`No worker registered to handle job: ${job.name} for provider: ${job.provider}`);
                }
                for (const worker of targetWorkers) {
                    await worker.execute(job.payload, job.correlationId);
                }
                const finishedAt = this.clockProvider.now();
                const duration = finishedAt.getTime() - startedAt.getTime();
                await this.jobRepo.insertHistory(job.id, 'COMPLETED', attempt, null, duration, startedAt, finishedAt);
                if (job.cron) {
                    const nextRun = new Date(finishedAt.getTime() + 60 * 60 * 1000);
                    await this.jobRepo.updateJobStatus(job.id, 'PENDING', 0, null, nextRun, finishedAt);
                }
                else {
                    await this.jobRepo.updateJobStatus(job.id, 'COMPLETED', attempt, null, job.runAt, finishedAt);
                }
            }
            catch (err) {
                const finishedAt = this.clockProvider.now();
                const duration = finishedAt.getTime() - startedAt.getTime();
                await this.jobRepo.insertHistory(job.id, 'FAILED', attempt, err.message, duration, startedAt, finishedAt);
                if (attempt >= job.maxAttempts) {
                    await this.jobRepo.updateJobStatus(job.id, 'FAILED', attempt, `Max attempts exceeded. Last error: ${err.message}`, job.runAt, finishedAt);
                }
                else {
                    const backoffDelay = Math.pow(2, attempt) * 1000 + Math.random() * 1000;
                    const nextRun = new Date(finishedAt.getTime() + backoffDelay);
                    await this.jobRepo.updateJobStatus(job.id, 'PENDING', attempt, err.message, nextRun, finishedAt);
                }
            }
        }
    };
    return SchedulerEngine = _classThis;
})();
exports.SchedulerEngine = SchedulerEngine;
//# sourceMappingURL=scheduler-engine.js.map