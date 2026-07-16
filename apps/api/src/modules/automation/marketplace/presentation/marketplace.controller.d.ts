import { MarketplaceService } from '../application/services/marketplace.service';
import { TemplateSearchService } from '../application/services/template-search.service';
import { TemplatePublisherService } from '../application/services/template-publisher.service';
import { TemplateInstallerService } from '../application/services/template-installer.service';
import { TemplateReviewService } from '../application/services/template-review.service';
import { ExtendedPrismaClient } from '../../../../infrastructure/database/prisma-extensions';
export declare class MarketplaceController {
    private readonly marketplaceService;
    private readonly searchService;
    private readonly publisherService;
    private readonly installerService;
    private readonly reviewService;
    private readonly prisma;
    constructor(marketplaceService: MarketplaceService, searchService: TemplateSearchService, publisherService: TemplatePublisherService, installerService: TemplateInstallerService, reviewService: TemplateReviewService, prisma: ExtendedPrismaClient);
    getTemplates(): Promise<({
        versions: {
            id: string;
            createdAt: Date;
            version: string;
            checksum: string;
            canvasJson: import("@prisma/client/runtime/library").JsonValue;
            definitionJson: import("@prisma/client/runtime/library").JsonValue;
            templateId: string;
            signature: string;
            changelog: string | null;
        }[];
    } & {
        description: string;
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        workspaceId: string | null;
        visibility: string;
        authorId: string;
        activeVersion: string;
    })[]>;
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
    searchTemplates(query: string, category: string, visibility: string): Promise<any[]>;
    getTemplate(id: string): Promise<{
        versions: {
            id: string;
            createdAt: Date;
            version: string;
            checksum: string;
            canvasJson: import("@prisma/client/runtime/library").JsonValue;
            definitionJson: import("@prisma/client/runtime/library").JsonValue;
            templateId: string;
            signature: string;
            changelog: string | null;
        }[];
        reviews: {
            id: string;
            createdAt: Date;
            workspaceId: string;
            templateId: string;
            rating: number;
            comment: string | null;
            isVerified: boolean;
        }[];
    } & {
        description: string;
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        workspaceId: string | null;
        visibility: string;
        authorId: string;
        activeVersion: string;
    }>;
    publishTemplate(name: string, description: string, canvasJson: any, visibility: any, version: string, changelog: string, req: any): Promise<any>;
    updateTemplate(id: string, description: string): Promise<{
        description: string;
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        workspaceId: string | null;
        visibility: string;
        authorId: string;
        activeVersion: string;
    }>;
    installTemplate(id: string, version: string, req: any): Promise<any>;
    rollbackInstallation(installationId: string, version: string, req: any): Promise<any>;
    createReview(id: string, rating: number, comment: string, req: any): Promise<any>;
    deleteReview(reviewId: string, req: any): Promise<{
        success: boolean;
    }>;
    getAnalytics(templateId: string): Promise<{
        id: string;
        updatedAt: Date;
        executions: number;
        templateId: string;
        installs: number;
        clones: number;
        successRate: number;
        averageRoi: number;
    } | {
        installs: number;
        clones: number;
        executions: number;
        successRate: number;
        averageRoi: number;
    }>;
}
