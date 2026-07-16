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
exports.NotificationPreferenceService = void 0;
const common_1 = require("@nestjs/common");
let NotificationPreferenceService = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var NotificationPreferenceService = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            NotificationPreferenceService = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        prisma;
        constructor(prisma) {
            this.prisma = prisma;
        }
        async isChannelAllowed(workspaceId, userId, channel, severity) {
            const pref = await this.prisma.automationNotificationPreference.findFirst({
                where: { workspaceId, userId, channel: channel.toUpperCase() },
            });
            if (pref) {
                if (!pref.enabled) {
                    return false;
                }
                const levelWeights = { INFO: 1, WARNING: 2, ERROR: 3, CRITICAL: 4 };
                const minWeight = levelWeights[pref.severityLevel.toUpperCase()] || 1;
                const targetWeight = levelWeights[severity.toUpperCase()] || 1;
                if (targetWeight < minWeight) {
                    return false;
                }
            }
            const quiet = await this.getQuietHours(workspaceId, userId);
            if (quiet && quiet.enabled) {
                const currentHour = new Date().getHours();
                if (quiet.startHour <= quiet.endHour) {
                    if (currentHour >= quiet.startHour && currentHour <= quiet.endHour) {
                        return false;
                    }
                }
                else {
                    if (currentHour >= quiet.startHour || currentHour <= quiet.endHour) {
                        return false;
                    }
                }
            }
            return true;
        }
        async getQuietHours(workspaceId, userId) {
            return {
                startHour: 22,
                endHour: 6,
                enabled: false,
            };
        }
    };
    return NotificationPreferenceService = _classThis;
})();
exports.NotificationPreferenceService = NotificationPreferenceService;
//# sourceMappingURL=notification-preference.service.js.map