import { Injectable } from '@nestjs/common';
import { MetaAdAccountRepository } from '../../../../infrastructure/database/repositories/meta-ad-account.repository';
import { MetaAdAccount } from '@prisma/client';

@Injectable()
export class MetaAdAccountService {
  constructor(private readonly repo: MetaAdAccountRepository) {}

  async getByWorkspace(workspaceId: string): Promise<MetaAdAccount[]> {
    return await this.repo.findByWorkspaceId(workspaceId);
  }
}
