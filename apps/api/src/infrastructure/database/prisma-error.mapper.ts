import { Prisma } from '@prisma/client';
import { 
  ConflictException, 
  NotFoundException, 
  BadRequestException 
} from '../../common/exceptions/app-exceptions';
import { BaseException } from '../../common/exceptions/base.exception';

export function mapPrismaError(error: unknown): unknown {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case 'P2002': {
        const targets = (error.meta?.target as string[]) || [];
        return new ConflictException(
          `Unique constraint violation on fields: ${targets.join(', ')}`
        );
      }
      case 'P2025':
        return new NotFoundException(
          error.meta?.cause as string || 'Requested record was not found'
        );
      case 'P2003':
        return new BadRequestException(
          'Foreign key constraint violation. Reference record is invalid.'
        );
      default:
        return new BaseException(
          error.message,
          undefined,
          500,
          [error.code]
        );
    }
  }
  return error;
}
