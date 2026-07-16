import { Prisma, PrismaClient } from '@prisma/client';
export declare function extendPrismaClient(client: PrismaClient): import("@prisma/client/runtime/library").DynamicClientExtensionThis<Prisma.TypeMap<import("@prisma/client/runtime/library").InternalArgs & {
    result: {};
    model: {};
    query: {};
    client: {};
}, Prisma.PrismaClientOptions>, Prisma.TypeMapCb, {
    result: {};
    model: {};
    query: {};
    client: {};
}, {}>;
export type ExtendedPrismaClient = ReturnType<typeof extendPrismaClient>;
