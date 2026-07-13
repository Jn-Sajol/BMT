import { Injectable } from '@nestjs/common';
import { MetaAdAccountPixelRepository } from '../../../../infrastructure/database/repositories/meta-ad-account-pixel.repository';
import { MetaAdAccountPixel } from '@prisma/client';

@Injectable()
export class MetaAdAccountRelationshipService {
  constructor(private readonly repo: MetaAdAccountPixelRepository) {}

  async getByWorkspace(workspaceId: string): Promise<MetaAdAccountPixel[]> {
    return await this.repo.findByWorkspaceId(workspaceId);
  }
}
