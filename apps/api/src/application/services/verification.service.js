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
exports.VerificationService = void 0;
const common_1 = require("@nestjs/common");
const verification_exceptions_1 = require("../../common/exceptions/verification-exceptions");
const verification_mapper_1 = require("../../common/mappers/verification.mapper");
let VerificationService = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var VerificationService = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            VerificationService = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        verificationRepo;
        userRepo;
        tokenGenerator;
        clockProvider;
        constructor(verificationRepo, userRepo, tokenGenerator, clockProvider) {
            this.verificationRepo = verificationRepo;
            this.userRepo = userRepo;
            this.tokenGenerator = tokenGenerator;
            this.clockProvider = clockProvider;
        }
        async createToken(dto) {
            const user = await this.userRepo.findById(dto.userId);
            if (!user || user.deletedAt) {
                throw new verification_exceptions_1.VerificationUserNotFoundException(dto.userId);
            }
            if (user.emailVerifiedAt) {
                throw new verification_exceptions_1.AlreadyVerifiedException(user.email);
            }
            const token = this.tokenGenerator.generate(32); // Generate a cryptographically secure token
            const now = this.clockProvider.now();
            const expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 24 hours expiry
            const verificationToken = {
                id: '',
                userId: dto.userId,
                tokenHash: token,
                tokenType: dto.tokenType,
                createdAt: now,
                expiresAt,
                usedAt: null,
            };
            return await this.verificationRepo.save(verificationToken);
        }
        async verifyEmail(dto) {
            const tokenRecord = await this.verificationRepo.findByTokenHash(dto.token);
            if (!tokenRecord || tokenRecord.usedAt) {
                throw new verification_exceptions_1.InvalidTokenException();
            }
            const now = this.clockProvider.now();
            if (tokenRecord.expiresAt < now) {
                throw new verification_exceptions_1.ExpiredTokenException();
            }
            const user = await this.userRepo.findById(tokenRecord.userId);
            if (!user || user.deletedAt) {
                throw new verification_exceptions_1.VerificationUserNotFoundException(tokenRecord.userId);
            }
            if (user.emailVerifiedAt) {
                // Mark token as used to clean up
                tokenRecord.usedAt = now;
                await this.verificationRepo.save(tokenRecord);
                throw new verification_exceptions_1.AlreadyVerifiedException(user.email);
            }
            // Update user status & verification date
            user.emailVerifiedAt = now;
            user.status = 'ACTIVE';
            await this.userRepo.save(user);
            // Mark token as used
            tokenRecord.usedAt = now;
            await this.verificationRepo.save(tokenRecord);
            return verification_mapper_1.VerificationMapper.toResponse(user);
        }
        async resendVerification(userId) {
            const user = await this.userRepo.findById(userId);
            if (!user || user.deletedAt) {
                throw new verification_exceptions_1.VerificationUserNotFoundException(userId);
            }
            if (user.emailVerifiedAt) {
                throw new verification_exceptions_1.AlreadyVerifiedException(user.email);
            }
            // Deactivate previous active tokens
            const lastActive = await this.verificationRepo.findLatestActiveToken(userId, 'EMAIL_VERIFICATION');
            if (lastActive) {
                lastActive.usedAt = this.clockProvider.now(); // Invalidate
                await this.verificationRepo.save(lastActive);
            }
            return await this.createToken({
                userId,
                tokenType: 'EMAIL_VERIFICATION',
            });
        }
    };
    return VerificationService = _classThis;
})();
exports.VerificationService = VerificationService;
//# sourceMappingURL=verification.service.js.map