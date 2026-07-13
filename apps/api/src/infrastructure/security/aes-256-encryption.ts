import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import { IEncryption } from '../../common/ports/encryption.interface';

@Injectable()
export class Aes256Encryption implements IEncryption {
  private readonly key: Buffer;

  constructor() {
    const rawKey = process.env.ENCRYPTION_KEY || 'default_mos_system_encryption_key_change_me_in_production';
    this.key = crypto.createHash('sha256').update(rawKey).digest();
  }

  encrypt(plainText: string): string {
    const iv = crypto.randomBytes(12);
    const cipher = crypto.createCipheriv('aes-256-gcm', this.key, iv);
    
    let encrypted = cipher.update(plainText, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    const tag = cipher.getAuthTag().toString('hex');
    return `${iv.toString('hex')}:${encrypted}:${tag}`;
  }

  decrypt(cipherText: string): string {
    const parts = cipherText.split(':');
    if (parts.length !== 3) {
      throw new Error('Invalid cipher text format');
    }
    
    const iv = Buffer.from(parts[0], 'hex');
    const encrypted = Buffer.from(parts[1], 'hex');
    const tag = Buffer.from(parts[2], 'hex');
    
    const decipher = crypto.createDecipheriv('aes-256-gcm', this.key, iv);
    decipher.setAuthTag(tag);
    
    let decrypted = decipher.update(encrypted as any, undefined, 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  }
}
