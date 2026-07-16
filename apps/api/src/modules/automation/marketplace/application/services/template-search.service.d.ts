import { ITemplateSearch, SearchFilters } from '../../domain/ports/template-search.interface';
import { ExtendedPrismaClient } from '../../../../../infrastructure/database/prisma-extensions';
export declare class TemplateSearchService implements ITemplateSearch {
    private readonly prisma;
    constructor(prisma: ExtendedPrismaClient);
    search(query: string, filters?: SearchFilters): Promise<any[]>;
}
