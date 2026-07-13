import { Injectable } from '@nestjs/common';
import { IMetaMediaUploader, IMetaMediaUploadResult } from './meta-media-uploader.interface';

@Injectable()
export class MetaMediaUploader implements IMetaMediaUploader {
  private readonly baseUrl = 'https://graph.facebook.com/v18.0';

  async uploadImage(
    fileBuffer: Buffer,
    filename: string,
    mimeType: string,
    accessToken: string,
    adAccountExternalId: string,
  ): Promise<IMetaMediaUploadResult> {
    const cleanAdAccountId = adAccountExternalId.startsWith('act_')
      ? adAccountExternalId
      : `act_${adAccountExternalId}`;

    const url = `${this.baseUrl}/${cleanAdAccountId}/adimages?access_token=${accessToken}`;
    const formData = new FormData();
    const blob = new Blob([new Uint8Array(fileBuffer)], { type: mimeType });
    formData.append('filename', blob, filename);

    const res = await fetch(url, {
      method: 'POST',
      body: formData,
    });

    if (!res.ok) {
      const errBody = await res.text();
      throw new Error(`Meta image upload failed: ${res.statusText} - ${errBody}`);
    }

    const response = await res.json();
    const key = Object.keys(response.images || {})[0];
    const imageData = response.images?.[key];

    if (!imageData || !imageData.hash) {
      throw new Error('Invalid empty image response received from Meta Graph API');
    }

    return {
      metaImageHash: imageData.hash,
      rawResponse: response,
    };
  }

  async uploadVideo(
    fileBuffer: Buffer,
    filename: string,
    mimeType: string,
    accessToken: string,
    adAccountExternalId: string,
  ): Promise<IMetaMediaUploadResult> {
    const cleanAdAccountId = adAccountExternalId.startsWith('act_')
      ? adAccountExternalId
      : `act_${adAccountExternalId}`;

    const url = `${this.baseUrl}/${cleanAdAccountId}/advideos?access_token=${accessToken}`;
    const formData = new FormData();
    const blob = new Blob([new Uint8Array(fileBuffer)], { type: mimeType });
    formData.append('source', blob, filename);

    const res = await fetch(url, {
      method: 'POST',
      body: formData,
    });

    if (!res.ok) {
      const errBody = await res.text();
      throw new Error(`Meta video upload failed: ${res.statusText} - ${errBody}`);
    }

    const response = await res.json();
    if (!response || !response.id) {
      throw new Error('Invalid empty video response received from Meta Graph API');
    }

    return {
      metaVideoId: response.id,
      rawResponse: response,
    };
  }
}
