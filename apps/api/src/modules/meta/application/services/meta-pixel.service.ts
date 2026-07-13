import { Injectable } from '@nestjs/common';
import { MetaPixelRepository } from '../../../../infrastructure/database/repositories/meta-pixel.repository';
import { MetaPixel } from '@prisma/client';

@Injectable()
export class MetaPixelService {
  constructor(private readonly repo: MetaPixelRepository) {}

  async getByWorkspace(workspaceId: string): Promise<MetaPixel[]> {
    return await this.repo.findByWorkspaceId(workspaceId);
  }
}
