export declare class MediaValidationService {
    private readonly allowedMimeTypes;
    private readonly allowedExtensions;
    validateFile(originalFilename: string, mimeType: string, size: number): void;
}
