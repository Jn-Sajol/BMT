import { Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class MediaValidationService {
  private readonly allowedMimeTypes = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'video/mp4',
    'video/quicktime',
  ];

  private readonly allowedExtensions = [
    '.jpg',
    '.jpeg',
    '.png',
    '.gif',
    '.mp4',
    '.mov',
  ];

  validateFile(originalFilename: string, mimeType: string, size: number): void {
    if (!this.allowedMimeTypes.includes(mimeType)) {
      throw new BadRequestException(`Mime type '${mimeType}' is not supported.`);
    }

    const dotIndex = originalFilename.lastIndexOf('.');
    if (dotIndex === -1) {
      throw new BadRequestException('Filename must include an extension.');
    }

    const extension = originalFilename.substring(dotIndex).toLowerCase();
    if (!this.allowedExtensions.includes(extension)) {
      throw new BadRequestException(`File extension '${extension}' is not supported.`);
    }

    const isImage = mimeType.startsWith('image/');
    const maxBytes = isImage ? 10 * 1024 * 1024 : 100 * 1024 * 1024; // 10MB image, 100MB video

    if (size > maxBytes) {
      const typeLabel = isImage ? 'Image' : 'Video';
      const sizeLabel = isImage ? '10MB' : '100MB';
      throw new BadRequestException(`${typeLabel} size exceeds the max limit of ${sizeLabel}.`);
    }
  }
}
