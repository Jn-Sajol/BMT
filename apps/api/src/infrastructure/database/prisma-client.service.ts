import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaClientService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaClientService.name);

  async onModuleInit() {
    this.logger.log('Connecting to PostgreSQL database...');
    try {
      await this.$connect();
      this.logger.log('Connected to PostgreSQL successfully.');
    } catch (err: any) {
      this.logger.warn(`PostgreSQL database offline (${err?.message || err}). Continuing in local dev fallback mode.`);
    }
  }

  async onModuleDestroy() {
    this.logger.log('Disconnecting from PostgreSQL database...');
    await this.$disconnect();
  }
}
