import { MediaUploadService } from '../services/media-upload.service';
import { CreateMediaFolderDto, MediaFolderResponseDto, MediaAssetResponseDto } from '../common/media.dto';
export declare class MediaController {
    private readonly mediaService;
    constructor(mediaService: MediaUploadService);
    createFolder(dto: CreateMediaFolderDto, req: any): Promise<MediaFolderResponseDto>;
    getFolders(req: any): Promise<MediaFolderResponseDto[]>;
    deleteFolder(id: string, req: any): Promise<void>;
    uploadFile(file: any, req: any): Promise<MediaAssetResponseDto>;
    getAssets(req: any): Promise<MediaAssetResponseDto[]>;
    deleteAsset(id: string, req: any): Promise<void>;
}
