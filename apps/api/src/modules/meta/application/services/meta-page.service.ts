import { Injectable } from '@nestjs/common';
import { MetaPageRepository } from '../../../../infrastructure/database/repositories/meta-page.repository';
import { MetaPage } from '@prisma/client';

@Injectable()
export class MetaPageService {
  constructor(private readonly repo: MetaPageRepository) {}

  async getByWorkspace(workspaceId: string): Promise<MetaPage[]> {
    return await this.repo.findByWorkspaceId(workspaceId);
  }
}
