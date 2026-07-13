import { Injectable } from '@nestjs/common';
import { MetaPageInstagramRepository } from '../../../../infrastructure/database/repositories/meta-page-instagram.repository';
import { MetaPageInstagram } from '@prisma/client';

@Injectable()
export class MetaPageRelationshipService {
  constructor(private readonly repo: MetaPageInstagramRepository) {}

  async getByWorkspace(workspaceId: string): Promise<MetaPageInstagram[]> {
    return await this.repo.findByWorkspaceId(workspaceId);
  }
}
