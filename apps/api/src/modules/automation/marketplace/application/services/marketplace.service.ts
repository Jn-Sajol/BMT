import { Injectable, Inject } from '@nestjs/common';
import { PRISMA_CLIENT } from '../../../../../infrastructure/database/constants';
import { ExtendedPrismaClient } from '../../../../../infrastructure/database/prisma-extensions';

@Injectable()
export class MarketplaceService {
  constructor(
    @Inject(PRISMA_CLIENT)
    private readonly prisma: ExtendedPrismaClient,
  ) {}

  async getCategories() {
    return await this.prisma.automationTemplateCategory.findMany();
  }

  async getTags() {
    return await this.prisma.automationTemplateTag.findMany();
  }

  async getFeatured() {
    return await this.prisma.automationTemplate.findMany({
      where: { visibility: 'OFFICIAL' },
      orderBy: { createdAt: 'desc' },
      take: 5,
    });
  }

  async getPopular() {
    return await this.prisma.automationTemplate.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
    });
  }

  async getRecommended() {
    return await this.prisma.automationTemplate.findMany({
      where: { visibility: 'OFFICIAL' },
      take: 5,
    });
  }
}
