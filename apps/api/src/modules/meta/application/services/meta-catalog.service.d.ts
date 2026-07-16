import { MetaCatalogRepository } from '../../../../infrastructure/database/repositories/meta-catalog.repository';
import { MetaCatalog } from '@prisma/client';
export declare class MetaCatalogService {
    private readonly repo;
    constructor(repo: MetaCatalogRepository);
    getByWorkspace(workspaceId: string): Promise<MetaCatalog[]>;
}
