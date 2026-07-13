import { Injectable } from '@nestjs/common';
import { MetaBusinessRepository } from '../../../../infrastructure/database/repositories/meta-business.repository';
import { MetaBusiness } from '@prisma/client';

@Injectable()
export class MetaBusinessService {
  constructor(private readonly repo: MetaBusinessRepository) {}

  async getByWorkspace(workspaceId: string): Promise<MetaBusiness[]> {
    return await this.repo.findByWorkspaceId(workspaceId);
  }
}
