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
exports.RoleRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_error_mapper_1 = require("../prisma-error.mapper");
let RoleRepository = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var RoleRepository = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            RoleRepository = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        prisma;
        constructor(prisma) {
            this.prisma = prisma;
        }
        async findById(id) {
            try {
                return await this.prisma.role.findUnique({
                    where: { id },
                    include: {
                        permissions: {
                            include: {
                                permission: true,
                            },
                        },
                    },
                });
            }
            catch (e) {
                throw (0, prisma_error_mapper_1.mapPrismaError)(e);
            }
        }
        async findByName(name) {
            try {
                return await this.prisma.role.findUnique({
                    where: { name },
                    include: {
                        permissions: {
                            include: {
                                permission: true,
                            },
                        },
                    },
                });
            }
            catch (e) {
                throw (0, prisma_error_mapper_1.mapPrismaError)(e);
            }
        }
        async findRolesByUserIdForWorkspace(userId, workspaceId) {
            try {
                const mappings = await this.prisma.userWorkspaceRole.findMany({
                    where: { userId, workspaceId },
                    include: {
                        role: {
                            include: {
                                permissions: {
                                    include: {
                                        permission: true,
                                    },
                                },
                            },
                        },
                    },
                });
                return mappings.map((m) => m.role);
            }
            catch (e) {
                throw (0, prisma_error_mapper_1.mapPrismaError)(e);
            }
        }
        async findRolesByUserIdForOrganization(userId, organizationId) {
            try {
                const membership = await this.prisma.organizationMember.findUnique({
                    where: {
                        organizationId_userId: {
                            organizationId,
                            userId,
                        },
                    },
                    include: {
                        role: {
                            include: {
                                permissions: {
                                    include: {
                                        permission: true,
                                    },
                                },
                            },
                        },
                    },
                });
                return membership && membership.role ? [membership.role] : [];
            }
            catch (e) {
                throw (0, prisma_error_mapper_1.mapPrismaError)(e);
            }
        }
        async assignPermissionToRole(roleId, permissionId) {
            try {
                return await this.prisma.rolePermission.create({
                    data: {
                        roleId,
                        permissionId,
                    },
                });
            }
            catch (e) {
                throw (0, prisma_error_mapper_1.mapPrismaError)(e);
            }
        }
        async revokePermissionFromRole(roleId, permissionId) {
            try {
                await this.prisma.rolePermission.delete({
                    where: {
                        roleId_permissionId: {
                            roleId,
                            permissionId,
                        },
                    },
                });
            }
            catch (e) {
                throw (0, prisma_error_mapper_1.mapPrismaError)(e);
            }
        }
        async assignWorkspaceRole(userId, workspaceId, roleId) {
            try {
                await this.prisma.userWorkspaceRole.upsert({
                    where: {
                        userId_workspaceId_roleId: {
                            userId,
                            workspaceId,
                            roleId,
                        },
                    },
                    update: {},
                    create: {
                        userId,
                        workspaceId,
                        roleId,
                    },
                });
            }
            catch (e) {
                throw (0, prisma_error_mapper_1.mapPrismaError)(e);
            }
        }
        async revokeWorkspaceRole(userId, workspaceId, roleId) {
            try {
                await this.prisma.userWorkspaceRole.delete({
                    where: {
                        userId_workspaceId_roleId: {
                            userId,
                            workspaceId,
                            roleId,
                        },
                    },
                });
            }
            catch (e) {
                throw (0, prisma_error_mapper_1.mapPrismaError)(e);
            }
        }
        async assignOrganizationRole(userId, organizationId, roleId) {
            try {
                await this.prisma.organizationMember.update({
                    where: {
                        organizationId_userId: {
                            organizationId,
                            userId,
                        },
                    },
                    data: {
                        roleId,
                    },
                });
            }
            catch (e) {
                throw (0, prisma_error_mapper_1.mapPrismaError)(e);
            }
        }
        async findUserWorkspaceRoles(userId) {
            try {
                return await this.prisma.userWorkspaceRole.findMany({
                    where: { userId },
                    include: {
                        workspace: true,
                        role: true,
                    },
                });
            }
            catch (e) {
                throw (0, prisma_error_mapper_1.mapPrismaError)(e);
            }
        }
        async findUserOrganizationRoles(userId) {
            try {
                return await this.prisma.organizationMember.findMany({
                    where: { userId },
                    include: {
                        organization: true,
                        role: true,
                    },
                });
            }
            catch (e) {
                throw (0, prisma_error_mapper_1.mapPrismaError)(e);
            }
        }
        async findAll() {
            try {
                return await this.prisma.role.findMany();
            }
            catch (e) {
                throw (0, prisma_error_mapper_1.mapPrismaError)(e);
            }
        }
        async save(entity) {
            try {
                return await this.prisma.role.upsert({
                    where: { id: entity.id || '' },
                    update: {
                        name: entity.name,
                        description: entity.description,
                        roleType: entity.roleType,
                    },
                    create: {
                        name: entity.name,
                        description: entity.description,
                        roleType: entity.roleType,
                    },
                });
            }
            catch (e) {
                throw (0, prisma_error_mapper_1.mapPrismaError)(e);
            }
        }
        async delete(id) {
            try {
                await this.prisma.role.delete({ where: { id } });
            }
            catch (e) {
                throw (0, prisma_error_mapper_1.mapPrismaError)(e);
            }
        }
    };
    return RoleRepository = _classThis;
})();
exports.RoleRepository = RoleRepository;
//# sourceMappingURL=role.repository.js.map