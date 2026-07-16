import { MetaPageRepository } from '../../../../infrastructure/database/repositories/meta-page.repository';
import { MetaPage } from '@prisma/client';
export declare class MetaPageService {
    private readonly repo;
    constructor(repo: MetaPageRepository);
    getByWorkspace(workspaceId: string): Promise<MetaPage[]>;
}
