"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MediaAssetResponseDto = exports.MediaFolderResponseDto = exports.UpdateMediaAssetDto = exports.CreateMediaAssetDto = exports.CreateMediaFolderDto = void 0;
class CreateMediaFolderDto {
    name;
    parentId;
}
exports.CreateMediaFolderDto = CreateMediaFolderDto;
class CreateMediaAssetDto {
    folderId;
    type; // IMAGE, VIDEO, GIF, DOCUMENT
    name;
    originalFilename;
    mimeType;
    extension;
    size;
    width;
    height;
    duration;
    storageProvider;
    storageKey;
    publicUrl;
    thumbnailUrl;
    checksum;
    metadata;
    tags;
}
exports.CreateMediaAssetDto = CreateMediaAssetDto;
class UpdateMediaAssetDto {
    name;
    folderId;
    tags;
}
exports.UpdateMediaAssetDto = UpdateMediaAssetDto;
class MediaFolderResponseDto {
    id;
    workspaceId;
    parentId;
    name;
    createdAt;
    updatedAt;
}
exports.MediaFolderResponseDto = MediaFolderResponseDto;
class MediaAssetResponseDto {
    id;
    workspaceId;
    folderId;
    type;
    name;
    originalFilename;
    mimeType;
    extension;
    size;
    width;
    height;
    duration;
    storageProvider;
    storageKey;
    publicUrl;
    thumbnailUrl;
    metaImageHash;
    metaVideoId;
    processingStatus;
    uploadStatus;
    checksum;
    metadata;
    createdBy;
    createdAt;
    updatedAt;
    tags;
}
exports.MediaAssetResponseDto = MediaAssetResponseDto;
//# sourceMappingURL=media.dto.js.map