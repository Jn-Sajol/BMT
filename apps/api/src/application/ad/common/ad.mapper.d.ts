import { Ad, AdLabel, AdTag } from '@prisma/client';
import { AdResponseDto } from './ad.dto';
export declare class AdMapper {
    static toResponse(entity: Ad & {
        labels?: AdLabel[];
        tags?: AdTag[];
    }): AdResponseDto;
}
