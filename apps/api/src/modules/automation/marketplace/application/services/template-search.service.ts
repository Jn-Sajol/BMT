import { Injectable, Inject } from '@nestjs/common';
import { ITemplateSearch, SearchFilters } from '../../domain/ports/template-search.interface';
import { PRISMA_CLIENT } from '../../../../../infrastructure/database/constants';
import { ExtendedPrismaClient } from '../../../../../infrastructure/database/prisma-extensions';

@Injectable()
export class TemplateSearchService implements ITemplateSearch {
  constructor(
    @Inject(PRISMA_CLIENT)
    private readonly prisma: ExtendedPrismaClient,
  ) {}

  async search(query: string, filters?: SearchFilters): Promise<any[]> {
    const where: any = {};

    if (query) {
      where.OR = [
        { name: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } },
      ];
    }

    if (filters?.visibility) {
      where.visibility = filters.visibility;
    }

    return await this.prisma.automationTemplate.findMany({
      where,
      include: { versions: true },
      take: 20,
    });
  }
}
