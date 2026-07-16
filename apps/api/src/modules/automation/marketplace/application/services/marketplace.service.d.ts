import { ExtendedPrismaClient } from '../../../../../infrastructure/database/prisma-extensions';
export declare class MarketplaceService {
    private readonly prisma;
    constructor(prisma: ExtendedPrismaClient);
    getCategories(): Promise<{
        name: string;
        id: string;
    }[]>;
    getTags(): Promise<{
        name: string;
        id: string;
    }[]>;
    getFeatured(): Promise<{
        description: string;
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        workspaceId: string | null;
        visibility: string;
        authorId: string;
        activeVersion: string;
    }[]>;
    getPopular(): Promise<{
        description: string;
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        workspaceId: string | null;
        visibility: string;
        authorId: string;
        activeVersion: string;
    }[]>;
    getRecommended(): Promise<{
        description: string;
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        workspaceId: string | null;
        visibility: string;
        authorId: string;
        activeVersion: string;
    }[]>;
}
