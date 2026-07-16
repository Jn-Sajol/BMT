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
exports.OrganizationMemberService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const organization_member_exceptions_1 = require("../../common/exceptions/organization-member-exceptions");
const organization_exceptions_1 = require("../../common/exceptions/organization-exceptions");
let OrganizationMemberService = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var OrganizationMemberService = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            OrganizationMemberService = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        memberRepo;
        orgRepo;
        userRepo;
        constructor(memberRepo, orgRepo, userRepo) {
            this.memberRepo = memberRepo;
            this.orgRepo = orgRepo;
            this.userRepo = userRepo;
        }
        async addMember(dto) {
            // 1. Verify organization exists
            const org = await this.orgRepo.findById(dto.organizationId);
            if (!org || org.deletedAt) {
                throw new organization_exceptions_1.OrganizationNotFoundException(dto.organizationId);
            }
            // 2. Verify user exists
            const user = await this.userRepo.findById(dto.userId);
            if (!user || user.deletedAt) {
                throw new Error(`User with ID '${dto.userId}' not found`);
            }
            // 3. Verify duplicate membership
            const existing = await this.memberRepo.findByOrgAndUser(dto.organizationId, dto.userId);
            if (existing && !existing.deletedAt) {
                throw new organization_member_exceptions_1.DuplicateMembershipException(dto.organizationId, dto.userId);
            }
            const member = {
                id: existing ? existing.id : '',
                organizationId: dto.organizationId,
                userId: dto.userId,
                status: dto.status || client_1.MembershipStatus.ACTIVE,
                roleId: null,
                createdAt: existing ? existing.createdAt : new Date(),
                updatedAt: new Date(),
                deletedAt: null,
            };
            return await this.memberRepo.save(member);
        }
        async getMember(orgId, userId) {
            const member = await this.memberRepo.findByOrgAndUser(orgId, userId);
            if (!member || member.deletedAt) {
                return null;
            }
            return member;
        }
        async updateMember(orgId, userId, dto) {
            const member = await this.memberRepo.findByOrgAndUser(orgId, userId);
            if (!member || member.deletedAt) {
                throw new organization_member_exceptions_1.OrganizationMemberNotFoundException(orgId, userId);
            }
            // Enforce owner membership rule
            const org = await this.orgRepo.findById(orgId);
            if (org && org.ownerUserId === userId && dto.status !== client_1.MembershipStatus.ACTIVE) {
                throw new organization_member_exceptions_1.OwnerRemovalException(userId, orgId);
            }
            // Validate status transitions
            const validTransitions = {
                [client_1.MembershipStatus.INVITED]: [client_1.MembershipStatus.ACTIVE, client_1.MembershipStatus.REMOVED],
                [client_1.MembershipStatus.ACTIVE]: [client_1.MembershipStatus.SUSPENDED, client_1.MembershipStatus.REMOVED],
                [client_1.MembershipStatus.SUSPENDED]: [client_1.MembershipStatus.ACTIVE, client_1.MembershipStatus.REMOVED],
                [client_1.MembershipStatus.REMOVED]: [client_1.MembershipStatus.ACTIVE],
            };
            if (!validTransitions[member.status].includes(dto.status)) {
                throw new organization_member_exceptions_1.InvalidStatusTransitionException(member.status, dto.status);
            }
            member.status = dto.status;
            member.updatedAt = new Date();
            return await this.memberRepo.save(member);
        }
        async removeMember(orgId, userId) {
            const member = await this.memberRepo.findByOrgAndUser(orgId, userId);
            if (!member || member.deletedAt) {
                throw new organization_member_exceptions_1.OrganizationMemberNotFoundException(orgId, userId);
            }
            // Enforce owner membership rule
            const org = await this.orgRepo.findById(orgId);
            if (org && org.ownerUserId === userId) {
                throw new organization_member_exceptions_1.OwnerRemovalException(userId, orgId);
            }
            member.status = client_1.MembershipStatus.REMOVED;
            member.deletedAt = new Date(); // Soft delete active
            member.updatedAt = new Date();
            await this.memberRepo.save(member);
        }
        async listMembers(dto) {
            const list = await this.memberRepo.findMembersByOrgId(dto.organizationId);
            let filtered = list;
            if (dto.status) {
                filtered = filtered.filter(m => m.status === dto.status);
            }
            const limit = dto.limit || 10;
            const offset = dto.offset || 0;
            return filtered.slice(offset, offset + limit);
        }
    };
    return OrganizationMemberService = _classThis;
})();
exports.OrganizationMemberService = OrganizationMemberService;
//# sourceMappingURL=organization-member.service.js.map