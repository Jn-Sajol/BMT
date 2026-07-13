import { Injectable } from '@nestjs/common';
import { MetaCatalogRepository } from '../../../../infrastructure/database/repositories/meta-catalog.repository';
import { MetaCatalog } from '@prisma/client';

@Injectable()
export class MetaCatalogService {
  constructor(private readonly repo: MetaCatalogRepository) {}

  async getByWorkspace(workspaceId: string): Promise<MetaCatalog[]> {
    return await this.repo.findByWorkspaceId(workspaceId);
  }
}
