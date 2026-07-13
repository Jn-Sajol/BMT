import { Injectable } from '@nestjs/common';
import { MetaBusinessPageRepository } from '../../../../infrastructure/database/repositories/meta-business-page.repository';
import { MetaBusinessPage } from '@prisma/client';

@Injectable()
export class MetaBusinessRelationshipService {
  constructor(private readonly repo: MetaBusinessPageRepository) {}

  async getByWorkspace(workspaceId: string): Promise<MetaBusinessPage[]> {
    return await this.repo.findByWorkspaceId(workspaceId);
  }
}
