import { Injectable, Inject } from '@nestjs/common';
import { User } from '@prisma/client';
import { IUserRepository } from '../../../common/ports/user-repository.interface';
import { PRISMA_CLIENT } from '../constants';
import { ExtendedPrismaClient } from '../prisma-extensions';
import { mapPrismaError } from '../prisma-error.mapper';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(
    @Inject(PRISMA_CLIENT)
    private readonly prisma: ExtendedPrismaClient,
  ) {}

  async findById(id: string): Promise<User | null> {
    try {
      return await this.prisma.user.findUnique({ where: { id } });
    } catch (e) {
      throw mapPrismaError(e) as Error;
    }
  }

  async findByEmail(email: string): Promise<User | null> {
    try {
      return await this.prisma.user.findUnique({ where: { email } });
    } catch (e) {
      throw mapPrismaError(e) as Error;
    }
  }

  async findAll(): Promise<User[]> {
    try {
      return await this.prisma.user.findMany();
    } catch (e) {
      throw mapPrismaError(e) as Error;
    }
  }

  async save(entity: User): Promise<User> {
    try {
      return await this.prisma.user.upsert({
        where: { id: entity.id || '' },
        update: {
          email: entity.email,
          name: entity.name,
          passwordHash: entity.passwordHash,
          status: entity.status,
        },
        create: {
          email: entity.email,
          name: entity.name,
          passwordHash: entity.passwordHash,
          status: entity.status,
        },
      });
    } catch (e) {
      throw mapPrismaError(e) as Error;
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await this.prisma.user.delete({ where: { id } });
    } catch (e) {
      throw mapPrismaError(e) as Error;
    }
  }
}
