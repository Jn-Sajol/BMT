import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import { IUuidProvider } from '../../common/ports/uuid-provider.interface';

@Injectable()
export class UuidProvider implements IUuidProvider {
  generate(): string {
    return crypto.randomUUID();
  }

  validate(uuid: string): boolean {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return uuidRegex.test(uuid);
  }
}
