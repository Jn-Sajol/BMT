import { IMetaMediaUploader, IMetaMediaUploadResult } from './meta-media-uploader.interface';
export declare class MetaMediaUploader implements IMetaMediaUploader {
    private readonly baseUrl;
    uploadImage(fileBuffer: Buffer, filename: string, mimeType: string, accessToken: string, adAccountExternalId: string): Promise<IMetaMediaUploadResult>;
    uploadVideo(fileBuffer: Buffer, filename: string, mimeType: string, accessToken: string, adAccountExternalId: string): Promise<IMetaMediaUploadResult>;
}
