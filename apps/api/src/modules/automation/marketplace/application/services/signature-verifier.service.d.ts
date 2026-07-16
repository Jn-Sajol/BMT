import { ISignatureVerifier } from '../../domain/ports/signature-verifier.interface';
export declare class SignatureVerifierService implements ISignatureVerifier {
    verify(canvasJson: any, signature: string, expectedChecksum: string): Promise<boolean>;
}
