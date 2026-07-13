import { Prisma, PrismaClient } from '@prisma/client';
import { RequestContext } from '../../common/context/request-context';

export function extendPrismaClient(client: PrismaClient) {
  return client.$extends({
    query: {
      $allModels: {
        async findMany({ model, args, query }) {
          const modelMeta = Prisma.dmmf.datamodel.models.find(m => m.name === model);
          const modelFields = modelMeta?.fields || [];
          const hasDeletedAt = modelFields.some((f: any) => f.name === 'deletedAt');
          const hasTenantId = modelFields.some((f: any) => f.name === 'tenantId');

          if (hasDeletedAt) {
            args.where = { ...args.where, deletedAt: null } as any;
          }
          if (hasTenantId && RequestContext.tenantId) {
            args.where = { ...args.where, tenantId: RequestContext.tenantId } as any;
          }
          return query(args);
        },
        async findFirst({ model, args, query }) {
          const modelMeta = Prisma.dmmf.datamodel.models.find(m => m.name === model);
          const modelFields = modelMeta?.fields || [];
          const hasDeletedAt = modelFields.some((f: any) => f.name === 'deletedAt');
          const hasTenantId = modelFields.some((f: any) => f.name === 'tenantId');

          if (hasDeletedAt) {
            args.where = { ...args.where, deletedAt: null } as any;
          }
          if (hasTenantId && RequestContext.tenantId) {
            args.where = { ...args.where, tenantId: RequestContext.tenantId } as any;
          }
          return query(args);
        },
        async count({ model, args, query }) {
          const modelMeta = Prisma.dmmf.datamodel.models.find(m => m.name === model);
          const modelFields = modelMeta?.fields || [];
          const hasDeletedAt = modelFields.some((f: any) => f.name === 'deletedAt');
          const hasTenantId = modelFields.some((f: any) => f.name === 'tenantId');

          if (hasDeletedAt) {
            args.where = { ...args.where, deletedAt: null } as any;
          }
          if (hasTenantId && RequestContext.tenantId) {
            args.where = { ...args.where, tenantId: RequestContext.tenantId } as any;
          }
          return query(args);
        },
        async create({ model, args, query }) {
          const modelMeta = Prisma.dmmf.datamodel.models.find(m => m.name === model);
          const modelFields = modelMeta?.fields || [];
          const hasTenantId = modelFields.some((f: any) => f.name === 'tenantId');
          const hasCreatedBy = modelFields.some((f: any) => f.name === 'createdBy');
          const hasUpdatedBy = modelFields.some((f: any) => f.name === 'updatedBy');

          const data = (args.data || {}) as any;

          if (hasTenantId && RequestContext.tenantId && !data.tenantId) {
            data.tenantId = RequestContext.tenantId;
          }
          if (hasCreatedBy && RequestContext.userId && !data.createdBy) {
            data.createdBy = RequestContext.userId;
          }
          if (hasUpdatedBy && RequestContext.userId && !data.updatedBy) {
            data.updatedBy = RequestContext.userId;
          }

          args.data = data;
          return query(args);
        },
        async update({ model, args, query }) {
          const modelMeta = Prisma.dmmf.datamodel.models.find(m => m.name === model);
          const modelFields = modelMeta?.fields || [];
          const hasTenantId = modelFields.some((f: any) => f.name === 'tenantId');
          const hasUpdatedBy = modelFields.some((f: any) => f.name === 'updatedBy');

          if (hasTenantId && RequestContext.tenantId) {
            args.where = { ...args.where, tenantId: RequestContext.tenantId } as any;
          }

          const data = (args.data || {}) as any;
          if (hasUpdatedBy && RequestContext.userId) {
            data.updatedBy = RequestContext.userId;
          }

          args.data = data;
          return query(args);
        },
        async delete({ model, args, query }) {
          const modelMeta = Prisma.dmmf.datamodel.models.find(m => m.name === model);
          const modelFields = modelMeta?.fields || [];
          const hasDeletedAt = modelFields.some((f: any) => f.name === 'deletedAt');
          const hasTenantId = modelFields.some((f: any) => f.name === 'tenantId');

          if (hasDeletedAt) {
            const data: any = { deletedAt: new Date() };
            const updateArgs: any = {
              where: args.where,
              data,
            };
            if (hasTenantId && RequestContext.tenantId) {
              updateArgs.where = { ...updateArgs.where, tenantId: RequestContext.tenantId };
            }
            return (client as any)[model].update(updateArgs);
          }
          return query(args);
        }
      }
    }
  });
}

export type ExtendedPrismaClient = ReturnType<typeof extendPrismaClient>;
