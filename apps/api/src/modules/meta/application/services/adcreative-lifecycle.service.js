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
exports.AdCreativeLifecycleService = void 0;
const common_1 = require("@nestjs/common");
const adcreative_lifecycle_mapper_1 = require("./adcreative-lifecycle.mapper");
const adcreative_lifecycle_exceptions_1 = require("../../../../common/exceptions/adcreative-lifecycle.exceptions");
let AdCreativeLifecycleService = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var AdCreativeLifecycleService = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            AdCreativeLifecycleService = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        lifecycleRepo;
        connectionRepo;
        publisher;
        clockProvider;
        encryptionService;
        constructor(lifecycleRepo, connectionRepo, publisher, clockProvider, encryptionService) {
            this.lifecycleRepo = lifecycleRepo;
            this.connectionRepo = connectionRepo;
            this.publisher = publisher;
            this.clockProvider = clockProvider;
            this.encryptionService = encryptionService;
        }
        async updateAdCreative(creativeId, workspaceId, userId, dto) {
            const creative = await this.lifecycleRepo.findById(creativeId);
            if (!creative || creative.campaign.workspaceId !== workspaceId) {
                throw new common_1.NotFoundException('Ad Creative not found.');
            }
            if (!creative.externalCreativeId) {
                throw new adcreative_lifecycle_exceptions_1.AdCreativeNotPublishedException(creativeId);
            }
            const hasImmutableChanges = dto.primaryText !== undefined ||
                dto.headline !== undefined ||
                dto.destinationUrl !== undefined;
            if (hasImmutableChanges) {
                throw new adcreative_lifecycle_exceptions_1.AdCreativeRecreationRequiredException(creativeId);
            }
            const accessToken = await this.getAccessToken(workspaceId);
            try {
                const response = await this.publisher.updateAdCreative(creative.externalCreativeId, { name: dto.name }, accessToken);
                const history = await this.lifecycleRepo.insertHistory(creativeId, 'UPDATE_NAME', creative.status, creative.status, userId, this.clockProvider.now(), response);
                return adcreative_lifecycle_mapper_1.AdCreativeLifecycleMapper.toHistoryDto(history);
            }
            catch (err) {
                throw new adcreative_lifecycle_exceptions_1.MetaOperationFailedException(err.message);
            }
        }
        async getAccessToken(workspaceId) {
            const connection = await this.connectionRepo.findByWorkspaceId(workspaceId);
            if (!connection || connection.status !== 'ACTIVE') {
                throw new common_1.NotFoundException('Active Meta Connection not found for workspace.');
            }
            const decrypted = this.encryptionService.decrypt(connection.encryptedAccessToken);
            if (!decrypted) {
                throw new Error('Failed to decrypt Meta connection token.');
            }
            return decrypted;
        }
    };
    return AdCreativeLifecycleService = _classThis;
})();
exports.AdCreativeLifecycleService = AdCreativeLifecycleService;
//# sourceMappingURL=adcreative-lifecycle.service.js.map