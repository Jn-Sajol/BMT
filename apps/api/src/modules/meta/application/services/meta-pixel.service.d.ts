import { MetaPixelRepository } from '../../../../infrastructure/database/repositories/meta-pixel.repository';
import { MetaPixel } from '@prisma/client';
export declare class MetaPixelService {
    private readonly repo;
    constructor(repo: MetaPixelRepository);
    getByWorkspace(workspaceId: string): Promise<MetaPixel[]>;
}
