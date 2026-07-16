import { Campaign, CampaignLabel, CampaignTag } from '@prisma/client';
import { CampaignResponseDto } from '../dto/campaign.dto';
export declare class CampaignMapper {
    static toResponse(entity: Campaign & {
        labels?: CampaignLabel[];
        tags?: CampaignTag[];
    }): CampaignResponseDto;
}
