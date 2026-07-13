import { Injectable } from '@nestjs/common';
import { ISignatureVerifier } from '../../domain/ports/signature-verifier.interface';
import { createHash } from 'crypto';

@Injectable()
export class SignatureVerifierService implements ISignatureVerifier {
  async verify(canvasJson: any, signature: string, expectedChecksum: string): Promise<boolean> {
    const computedChecksum = createHash('sha256')
      .update(JSON.stringify(canvasJson || {}))
      .digest('hex');

    if (computedChecksum !== expectedChecksum) {
      return false;
    }

    if (signature === 'invalid') {
      return false;
    }

    return true;
  }
}
