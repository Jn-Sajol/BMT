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
exports.WorkspaceRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_error_mapper_1 = require("../prisma-error.mapper");
let WorkspaceRepository = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var WorkspaceRepository = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            WorkspaceRepository = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        prisma;
        constructor(prisma) {
            this.prisma = prisma;
        }
        async findById(id) {
            try {
                return await this.prisma.workspace.findUnique({ where: { id } });
            }
            catch (e) {
                throw (0, prisma_error_mapper_1.mapPrismaError)(e);
            }
        }
        async findBySlug(orgId, slug) {
            try {
                return await this.prisma.workspace.findUnique({
                    where: {
                        organizationId_slug: {
                            organizationId: orgId,
                            slug,
                        },
                    },
                });
            }
            catch (e) {
                throw (0, prisma_error_mapper_1.mapPrismaError)(e);
            }
        }
        async findAll() {
            try {
                return await this.prisma.workspace.findMany();
            }
            catch (e) {
                throw (0, prisma_error_mapper_1.mapPrismaError)(e);
            }
        }
        async save(entity) {
            try {
                return await this.prisma.workspace.upsert({
                    where: { id: entity.id || '' },
                    update: {
                        name: entity.name,
                        slug: entity.slug,
                        description: entity.description,
                        workspaceType: entity.workspaceType,
                        visibility: entity.visibility,
                        status: entity.status,
                        deletedAt: entity.deletedAt,
                    },
                    create: {
                        organizationId: entity.organizationId,
                        name: entity.name,
                        slug: entity.slug,
                        description: entity.description,
                        workspaceType: entity.workspaceType,
                        visibility: entity.visibility,
                        status: entity.status,
                        deletedAt: entity.deletedAt,
                    },
                });
            }
            catch (e) {
                throw (0, prisma_error_mapper_1.mapPrismaError)(e);
            }
        }
        async delete(id) {
            try {
                await this.prisma.workspace.delete({ where: { id } });
            }
            catch (e) {
                throw (0, prisma_error_mapper_1.mapPrismaError)(e);
            }
        }
        async findSettingsByWorkspaceId(workspaceId) {
            try {
                return await this.prisma.workspaceSettings.findUnique({ where: { workspaceId } });
            }
            catch (e) {
                throw (0, prisma_error_mapper_1.mapPrismaError)(e);
            }
        }
        async findPreferencesByWorkspaceId(workspaceId) {
            try {
                return await this.prisma.workspacePreferences.findUnique({ where: { workspaceId } });
            }
            catch (e) {
                throw (0, prisma_error_mapper_1.mapPrismaError)(e);
            }
        }
        async saveSettings(settings) {
            try {
                return await this.prisma.workspaceSettings.upsert({
                    where: { workspaceId: settings.workspaceId },
                    update: {
                        timezone: settings.timezone,
                        language: settings.language,
                        dateFormat: settings.dateFormat,
                        timeFormat: settings.timeFormat,
                        theme: settings.theme,
                        defaultLandingPage: settings.defaultLandingPage,
                        notificationPrefs: settings.notificationPrefs || {},
                    },
                    create: {
                        workspaceId: settings.workspaceId,
                        timezone: settings.timezone,
                        language: settings.language,
                        dateFormat: settings.dateFormat,
                        timeFormat: settings.timeFormat,
                        theme: settings.theme,
                        defaultLandingPage: settings.defaultLandingPage,
                        notificationPrefs: settings.notificationPrefs || {},
                    },
                });
            }
            catch (e) {
                throw (0, prisma_error_mapper_1.mapPrismaError)(e);
            }
        }
        async savePreferences(prefs) {
            try {
                return await this.prisma.workspacePreferences.upsert({
                    where: { workspaceId: prefs.workspaceId },
                    update: {
                        preferences: prefs.preferences || {},
                    },
                    create: {
                        workspaceId: prefs.workspaceId,
                        preferences: prefs.preferences || {},
                    },
                });
            }
            catch (e) {
                throw (0, prisma_error_mapper_1.mapPrismaError)(e);
            }
        }
        async findMembersByWorkspaceId(workspaceId) {
            try {
                return await this.prisma.workspaceMember.findMany({ where: { workspaceId } });
            }
            catch (e) {
                throw (0, prisma_error_mapper_1.mapPrismaError)(e);
            }
        }
        async addMember(member) {
            try {
                return await this.prisma.workspaceMember.create({
                    data: {
                        workspaceId: member.workspaceId,
                        userId: member.userId,
                    },
                });
            }
            catch (e) {
                throw (0, prisma_error_mapper_1.mapPrismaError)(e);
            }
        }
        async removeMember(workspaceId, userId) {
            try {
                await this.prisma.workspaceMember.delete({
                    where: {
                        workspaceId_userId: {
                            workspaceId,
                            userId,
                        },
                    },
                });
            }
            catch (e) {
                throw (0, prisma_error_mapper_1.mapPrismaError)(e);
            }
        }
    };
    return WorkspaceRepository = _classThis;
})();
exports.WorkspaceRepository = WorkspaceRepository;
//# sourceMappingURL=workspace.repository.js.map