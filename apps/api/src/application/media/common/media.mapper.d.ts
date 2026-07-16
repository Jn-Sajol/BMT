import { MediaAsset, MediaFolder, MediaTag } from '@prisma/client';
import { MediaAssetResponseDto, MediaFolderResponseDto } from './media.dto';
export declare class MediaMapper {
    static toFolderResponse(entity: MediaFolder): MediaFolderResponseDto;
    static toAssetResponse(entity: MediaAsset & {
        tags?: MediaTag[];
    }): MediaAssetResponseDto;
}
