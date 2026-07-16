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
exports.OrganizationService = void 0;
const common_1 = require("@nestjs/common");
const organization_exceptions_1 = require("../../common/exceptions/organization-exceptions");
let OrganizationService = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var OrganizationService = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            OrganizationService = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        orgRepo;
        userRepo;
        constructor(orgRepo, userRepo) {
            this.orgRepo = orgRepo;
            this.userRepo = userRepo;
        }
        async create(dto) {
            // 1. Validate owner existence
            const owner = await this.userRepo.findById(dto.ownerUserId);
            if (!owner) {
                throw new organization_exceptions_1.OwnerNotFoundException(dto.ownerUserId);
            }
            // 2. Validate slug uniqueness
            const existing = await this.orgRepo.findBySlug(dto.slug);
            if (existing) {
                throw new organization_exceptions_1.DuplicateSlugException(dto.slug);
            }
            const org = {
                id: '',
                name: dto.name,
                slug: dto.slug.toLowerCase(),
                status: 'ACTIVE',
                ownerUserId: dto.ownerUserId,
                createdAt: new Date(),
                updatedAt: new Date(),
                deletedAt: null,
            };
            return await this.orgRepo.save(org);
        }
        async findById(id) {
            const org = await this.orgRepo.findById(id);
            if (!org || org.deletedAt) {
                return null;
            }
            return org;
        }
        async findBySlug(slug) {
            const org = await this.orgRepo.findBySlug(slug);
            if (!org || org.deletedAt) {
                return null;
            }
            return org;
        }
        async update(id, dto) {
            const org = await this.orgRepo.findById(id);
            if (!org || org.deletedAt) {
                throw new organization_exceptions_1.OrganizationNotFoundException(id);
            }
            if (dto.slug && dto.slug.toLowerCase() !== org.slug) {
                const existing = await this.orgRepo.findBySlug(dto.slug.toLowerCase());
                if (existing) {
                    throw new organization_exceptions_1.DuplicateSlugException(dto.slug);
                }
                org.slug = dto.slug.toLowerCase();
            }
            if (dto.name) {
                org.name = dto.name;
            }
            org.updatedAt = new Date();
            return await this.orgRepo.save(org);
        }
        async archive(id) {
            const org = await this.orgRepo.findById(id);
            if (!org || org.deletedAt) {
                throw new organization_exceptions_1.OrganizationNotFoundException(id);
            }
            org.status = 'ARCHIVED';
            org.deletedAt = new Date(); // Soft delete triggers in Prisma extensions
            org.updatedAt = new Date();
            return await this.orgRepo.save(org);
        }
        async restore(id) {
            // Query directly bypassing soft-delete (using prisma direct fetch in repo)
            const org = await this.orgRepo.findById(id);
            if (!org) {
                throw new organization_exceptions_1.OrganizationNotFoundException(id);
            }
            org.status = 'ACTIVE';
            org.deletedAt = null;
            org.updatedAt = new Date();
            return await this.orgRepo.save(org);
        }
        async list(dto) {
            // Prisma findMany automatically appends deletedAt: null from extensions
            const orgs = await this.orgRepo.findAll();
            let filtered = orgs;
            if (dto.status) {
                filtered = filtered.filter(o => o.status === dto.status);
            }
            const limit = dto.limit || 10;
            const offset = dto.offset || 0;
            return filtered.slice(offset, offset + limit);
        }
    };
    return OrganizationService = _classThis;
})();
exports.OrganizationService = OrganizationService;
//# sourceMappingURL=organization.service.js.map