import { ExecutionContext } from '@nestjs/common';

export interface ICurrentUserExtractor<TUser> {
  extract(context: ExecutionContext): TUser | null;
}
