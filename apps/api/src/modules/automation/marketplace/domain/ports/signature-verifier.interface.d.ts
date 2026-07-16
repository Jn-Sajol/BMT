export interface ISignatureVerifier {
    verify(canvasJson: any, signature: string, expectedChecksum: string): Promise<boolean>;
}
