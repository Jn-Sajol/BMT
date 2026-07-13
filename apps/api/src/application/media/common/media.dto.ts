export class CreateMediaFolderDto {
  name!: string;
  parentId?: string;
}

export class CreateMediaAssetDto {
  folderId?: string;
  type!: string; // IMAGE, VIDEO, GIF, DOCUMENT
  name!: string;
  originalFilename!: string;
  mimeType!: string;
  extension!: string;
  size!: number;
  width?: number;
  height?: number;
  duration?: number;
  storageProvider!: string;
  storageKey!: string;
  publicUrl!: string;
  thumbnailUrl?: string;
  checksum!: string;
  metadata?: any;
  tags?: string[];
}

export class UpdateMediaAssetDto {
  name?: string;
  folderId?: string;
  tags?: string[];
}

export class MediaFolderResponseDto {
  id!: string;
  workspaceId!: string;
  parentId?: string;
  name!: string;
  createdAt!: string;
  updatedAt!: string;
}

export class MediaAssetResponseDto {
  id!: string;
  workspaceId!: string;
  folderId?: string;
  type!: string;
  name!: string;
  originalFilename!: string;
  mimeType!: string;
  extension!: string;
  size!: number;
  width?: number;
  height?: number;
  duration?: number;
  storageProvider!: string;
  storageKey!: string;
  publicUrl!: string;
  thumbnailUrl?: string;
  metaImageHash?: string;
  metaVideoId?: string;
  processingStatus!: string;
  uploadStatus!: string;
  checksum!: string;
  metadata!: any;
  createdBy!: string;
  createdAt!: string;
  updatedAt!: string;
  tags!: string[];
}
