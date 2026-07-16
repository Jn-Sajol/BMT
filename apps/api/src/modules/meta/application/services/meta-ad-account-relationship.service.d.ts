import { MetaAdAccountPixelRepository } from '../../../../infrastructure/database/repositories/meta-ad-account-pixel.repository';
import { MetaAdAccountPixel } from '@prisma/client';
export declare class MetaAdAccountRelationshipService {
    private readonly repo;
    constructor(repo: MetaAdAccountPixelRepository);
    getByWorkspace(workspaceId: string): Promise<MetaAdAccountPixel[]>;
}
