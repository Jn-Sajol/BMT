export interface IMetaMediaUploadResult {
  metaImageHash?: string;
  metaVideoId?: string;
  rawResponse: any;
}

export interface IMetaMediaUploader {
  uploadImage(
    fileBuffer: Buffer,
    filename: string,
    mimeType: string,
    accessToken: string,
    adAccountExternalId: string,
  ): Promise<IMetaMediaUploadResult>;

  uploadVideo(
    fileBuffer: Buffer,
    filename: string,
    mimeType: string,
    accessToken: string,
    adAccountExternalId: string,
  ): Promise<IMetaMediaUploadResult>;
}
