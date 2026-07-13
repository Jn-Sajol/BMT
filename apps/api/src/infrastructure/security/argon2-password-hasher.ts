import { Injectable } from '@nestjs/common';
import * as argon2 from 'argon2';
import { IPasswordHasher } from '../../common/ports/password-hasher.interface';

@Injectable()
export class Argon2PasswordHasher implements IPasswordHasher {
  async hash(password: string): Promise<string> {
    return await argon2.hash(password);
  }

  async compare(password: string, hash: string): Promise<boolean> {
    return await argon2.verify(hash, password);
  }
}
