import { Injectable } from '@nestjs/common';
import { MetaInstagramAccountRepository } from '../../../../infrastructure/database/repositories/meta-instagram.repository';
import { MetaInstagramAccount } from '@prisma/client';

@Injectable()
export class MetaInstagramService {
  constructor(private readonly repo: MetaInstagramAccountRepository) {}

  async getByWorkspace(workspaceId: string): Promise<MetaInstagramAccount[]> {
    return await this.repo.findByWorkspaceId(workspaceId);
  }
}
