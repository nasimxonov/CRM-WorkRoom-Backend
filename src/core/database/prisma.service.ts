import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
@Injectable()
export class PrismaService implements OnModuleInit {
  public prisma: PrismaClient;
  private logger: Logger = new Logger(PrismaService.name);
  constructor() {
    this.prisma = new PrismaClient();
  }
  async onModuleInit() {
    try {
      await this.prisma.$connect();
      this.logger.log('Database connected');
    } catch (error) {
      this.logger.error(error.message);
    }
  }
}
