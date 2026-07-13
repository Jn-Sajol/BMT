import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import { IRandomStringGenerator } from '../../common/ports/random-string-generator.interface';

@Injectable()
export class RandomStringGenerator implements IRandomStringGenerator {
  generate(length: number): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charsLength = chars.length;
    const randomBytes = crypto.randomBytes(length);
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(randomBytes[i] % charsLength);
    }
    return result;
  }
}
