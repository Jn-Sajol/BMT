import { AdSet, AdSetLabel, AdSetTag } from '@prisma/client';
import { AdSetResponseDto } from './adset.dto';
export declare class AdSetMapper {
    static toResponse(entity: AdSet & {
        labels?: AdSetLabel[];
        tags?: AdSetTag[];
    }): AdSetResponseDto;
}
