import { Injectable, Inject } from '@nestjs/common';
import { PRISMA_CLIENT } from '../../database/constants';
import { ExtendedPrismaClient } from '../../database/prisma-extensions';

@Injectable()
export class HealthService {
  constructor(
    @Inject(PRISMA_CLIENT)
    private readonly prisma: ExtendedPrismaClient,
  ) {}

  async checkDatabase(): Promise<boolean> {
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      return true;
    } catch (err) {
      return false;
    }
  }

  async checkStorage(): Promise<boolean> {
    return true;
  }

  async checkQueue(): Promise<boolean> {
    return true;
  }

  async checkFullStatus(): Promise<any> {
    const db = await this.checkDatabase();
    const storage = await this.checkStorage();
    const queue = await this.checkQueue();

    const status = db && storage && queue ? 'UP' : 'DOWN';

    return {
      status,
      timestamp: new Date().toISOString(),
      details: {
        database: db ? 'UP' : 'DOWN',
        storage: storage ? 'UP' : 'DOWN',
        queue: queue ? 'UP' : 'DOWN',
      },
    };
  }
}
