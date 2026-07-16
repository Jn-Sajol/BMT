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
exports.MetaAuthService = void 0;
const common_1 = require("@nestjs/common");
let MetaAuthService = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var MetaAuthService = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            MetaAuthService = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        metaConnRepo;
        oauthProvider;
        tokenGenerator;
        encryptionService;
        clockProvider;
        // In-memory registry to validate OAuth states and track tenant boundaries
        activeStates = new Map();
        constructor(metaConnRepo, oauthProvider, tokenGenerator, encryptionService, clockProvider) {
            this.metaConnRepo = metaConnRepo;
            this.oauthProvider = oauthProvider;
            this.tokenGenerator = tokenGenerator;
            this.encryptionService = encryptionService;
            this.clockProvider = clockProvider;
        }
        async connect(workspaceId, organizationId, userId) {
            const state = this.tokenGenerator.generate(24);
            const now = this.clockProvider.now();
            // Cache state with 15-minute TTL
            this.activeStates.set(state, {
                workspaceId,
                organizationId,
                userId,
                createdAt: now,
            });
            const authorizationUrl = this.oauthProvider.getAuthorizationUrl(state);
            return {
                authorizationUrl,
                state,
            };
        }
        async callback(code, state, currentUserId) {
            const stateContext = this.activeStates.get(state);
            if (!stateContext) {
                throw new common_1.UnauthorizedException('OAuth verification state has expired or is invalid');
            }
            // CSRF Protection validation
            if (stateContext.userId !== currentUserId) {
                throw new common_1.UnauthorizedException('Authentication identity mismatch during callback');
            }
            const now = this.clockProvider.now();
            const isStateExpired = now.getTime() - stateContext.createdAt.getTime() > 15 * 60 * 1000;
            if (isStateExpired) {
                this.activeStates.delete(state);
                throw new common_1.UnauthorizedException('OAuth state verification window has expired');
            }
            // 1. Exchange short-lived token
            const shortTokenData = await this.oauthProvider.exchangeCode(code);
            // 2. Exchange to long-lived access token
            const longTokenData = await this.oauthProvider.exchangeLongLivedToken(shortTokenData.accessToken);
            // 3. Validate Token & retrieve Facebook metadata
            const validation = await this.oauthProvider.validateToken(longTokenData.accessToken);
            if (!validation.isValid) {
                throw new common_1.BadRequestException('Meta Graph API token validation check failed');
            }
            // 4. Encrypt Long-Lived Token
            const encryptedAccessToken = this.encryptionService.encrypt(longTokenData.accessToken);
            const expiresAt = new Date(now.getTime() + longTokenData.expiresIn * 1000);
            // 5. Look up existing connection for the workspace to allow reconnect
            const existingConnection = await this.metaConnRepo.findByWorkspaceId(stateContext.workspaceId);
            const connection = {
                id: existingConnection ? existingConnection.id : '',
                facebookUserId: validation.facebookUserId,
                facebookUserName: validation.facebookUserName,
                encryptedAccessToken,
                expiresAt,
                grantedScopes: validation.scopes,
                provider: 'meta',
                status: 'ACTIVE',
                connectedBy: currentUserId,
                organizationId: stateContext.organizationId,
                workspaceId: stateContext.workspaceId,
                lastValidatedAt: now,
                connectionVersion: existingConnection ? existingConnection.connectionVersion + 1 : 1,
                createdAt: existingConnection ? existingConnection.createdAt : now,
                updatedAt: now,
            };
            await this.metaConnRepo.save(connection);
            // Log connection success
            console.log(`[AUDIT] Connection Created. Actor: ${currentUserId}, Timestamp: ${now.toISOString()}`);
            this.activeStates.delete(state);
            return {
                success: true,
                facebookUserId: validation.facebookUserId,
                facebookUserName: validation.facebookUserName,
                expiresAt: expiresAt.toISOString(),
            };
        }
        async disconnect(workspaceId, userId) {
            const connection = await this.metaConnRepo.findByWorkspaceId(workspaceId);
            if (!connection) {
                throw new common_1.BadRequestException('No active Meta connection found for this workspace');
            }
            await this.metaConnRepo.delete(connection.id);
            const now = this.clockProvider.now();
            // Log disconnection
            console.log(`[AUDIT] Connection Revoked. Actor: ${userId}, Timestamp: ${now.toISOString()}`);
            return {
                success: true,
                message: 'Meta connection has been successfully disconnected',
            };
        }
        async status(workspaceId) {
            const connection = await this.metaConnRepo.findByWorkspaceId(workspaceId);
            if (!connection) {
                return { isConnected: false };
            }
            const now = this.clockProvider.now();
            const isExpired = connection.expiresAt < now;
            const status = isExpired ? 'EXPIRED' : connection.status;
            return {
                isConnected: true,
                facebookUserId: connection.facebookUserId,
                facebookUserName: connection.facebookUserName,
                expiresAt: connection.expiresAt.toISOString(),
                grantedScopes: connection.grantedScopes,
                lastValidatedAt: connection.lastValidatedAt.toISOString(),
                status,
            };
        }
    };
    return MetaAuthService = _classThis;
})();
exports.MetaAuthService = MetaAuthService;
//# sourceMappingURL=meta-auth.service.js.map