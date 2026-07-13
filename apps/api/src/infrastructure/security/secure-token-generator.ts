import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import { ITokenGenerator } from '../../common/ports/token-generator.interface';

@Injectable()
export class SecureTokenGenerator implements ITokenGenerator {
  generate(entropyBytes = 32): string {
    return crypto.randomBytes(entropyBytes).toString('hex');
  }
}
