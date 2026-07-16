import { AdCreative, AdCreativeLabel, AdCreativeTag } from '@prisma/client';
import { AdCreativeResponseDto } from './adcreative.dto';
export declare class AdCreativeMapper {
    static toResponse(entity: AdCreative & {
        labels?: AdCreativeLabel[];
        tags?: AdCreativeTag[];
    }): AdCreativeResponseDto;
}
