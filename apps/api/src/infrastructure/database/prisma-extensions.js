"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extendPrismaClient = extendPrismaClient;
const client_1 = require("@prisma/client");
const request_context_1 = require("../../common/context/request-context");
function extendPrismaClient(client) {
    return client.$extends({
        query: {
            $allModels: {
                async findMany({ model, args, query }) {
                    const modelMeta = client_1.Prisma.dmmf.datamodel.models.find(m => m.name === model);
                    const modelFields = modelMeta?.fields || [];
                    const hasDeletedAt = modelFields.some((f) => f.name === 'deletedAt');
                    const hasTenantId = modelFields.some((f) => f.name === 'tenantId');
                    if (hasDeletedAt) {
                        args.where = { ...args.where, deletedAt: null };
                    }
                    if (hasTenantId && request_context_1.RequestContext.tenantId) {
                        args.where = { ...args.where, tenantId: request_context_1.RequestContext.tenantId };
                    }
                    return query(args);
                },
                async findFirst({ model, args, query }) {
                    const modelMeta = client_1.Prisma.dmmf.datamodel.models.find(m => m.name === model);
                    const modelFields = modelMeta?.fields || [];
                    const hasDeletedAt = modelFields.some((f) => f.name === 'deletedAt');
                    const hasTenantId = modelFields.some((f) => f.name === 'tenantId');
                    if (hasDeletedAt) {
                        args.where = { ...args.where, deletedAt: null };
                    }
                    if (hasTenantId && request_context_1.RequestContext.tenantId) {
                        args.where = { ...args.where, tenantId: request_context_1.RequestContext.tenantId };
                    }
                    return query(args);
                },
                async count({ model, args, query }) {
                    const modelMeta = client_1.Prisma.dmmf.datamodel.models.find(m => m.name === model);
                    const modelFields = modelMeta?.fields || [];
                    const hasDeletedAt = modelFields.some((f) => f.name === 'deletedAt');
                    const hasTenantId = modelFields.some((f) => f.name === 'tenantId');
                    if (hasDeletedAt) {
                        args.where = { ...args.where, deletedAt: null };
                    }
                    if (hasTenantId && request_context_1.RequestContext.tenantId) {
                        args.where = { ...args.where, tenantId: request_context_1.RequestContext.tenantId };
                    }
                    return query(args);
                },
                async create({ model, args, query }) {
                    const modelMeta = client_1.Prisma.dmmf.datamodel.models.find(m => m.name === model);
                    const modelFields = modelMeta?.fields || [];
                    const hasTenantId = modelFields.some((f) => f.name === 'tenantId');
                    const hasCreatedBy = modelFields.some((f) => f.name === 'createdBy');
                    const hasUpdatedBy = modelFields.some((f) => f.name === 'updatedBy');
                    const data = (args.data || {});
                    if (hasTenantId && request_context_1.RequestContext.tenantId && !data.tenantId) {
                        data.tenantId = request_context_1.RequestContext.tenantId;
                    }
                    if (hasCreatedBy && request_context_1.RequestContext.userId && !data.createdBy) {
                        data.createdBy = request_context_1.RequestContext.userId;
                    }
                    if (hasUpdatedBy && request_context_1.RequestContext.userId && !data.updatedBy) {
                        data.updatedBy = request_context_1.RequestContext.userId;
                    }
                    args.data = data;
                    return query(args);
                },
                async update({ model, args, query }) {
                    const modelMeta = client_1.Prisma.dmmf.datamodel.models.find(m => m.name === model);
                    const modelFields = modelMeta?.fields || [];
                    const hasTenantId = modelFields.some((f) => f.name === 'tenantId');
                    const hasUpdatedBy = modelFields.some((f) => f.name === 'updatedBy');
                    if (hasTenantId && request_context_1.RequestContext.tenantId) {
                        args.where = { ...args.where, tenantId: request_context_1.RequestContext.tenantId };
                    }
                    const data = (args.data || {});
                    if (hasUpdatedBy && request_context_1.RequestContext.userId) {
                        data.updatedBy = request_context_1.RequestContext.userId;
                    }
                    args.data = data;
                    return query(args);
                },
                async delete({ model, args, query }) {
                    const modelMeta = client_1.Prisma.dmmf.datamodel.models.find(m => m.name === model);
                    const modelFields = modelMeta?.fields || [];
                    const hasDeletedAt = modelFields.some((f) => f.name === 'deletedAt');
                    const hasTenantId = modelFields.some((f) => f.name === 'tenantId');
                    if (hasDeletedAt) {
                        const data = { deletedAt: new Date() };
                        const updateArgs = {
                            where: args.where,
                            data,
                        };
                        if (hasTenantId && request_context_1.RequestContext.tenantId) {
                            updateArgs.where = { ...updateArgs.where, tenantId: request_context_1.RequestContext.tenantId };
                        }
                        return client[model].update(updateArgs);
                    }
                    return query(args);
                }
            }
        }
    });
}
//# sourceMappingURL=prisma-extensions.js.map