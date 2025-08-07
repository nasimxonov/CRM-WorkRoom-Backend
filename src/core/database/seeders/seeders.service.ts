import { Logger, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { ConfigService } from '@nestjs/config';

export class SeedersService implements OnModuleInit {
  username: string;
  password: string;

  public logger: Logger = new Logger(SeedersService.name);
  constructor(
    private db: PrismaService,
    private configService: ConfigService,
  ) {
    this.username = this.configService.get('SUPER_ADMIN_USERNAME') as string;
    this.password = this.configService.get('SUPER_ADMIN_PASSWORD') as string;
  }

  async onModuleInit() {
    this.initSeeder();
  }

  async initSeeder() {
    try {
        await this.checkExistingAdmin()
        await this.createAdmin()
        this.logger.log("Admin created.")
    } catch (error) {
        this.logger.warn(error.message)
    }
  }
  async checkExistingAdmin() {
    const findAdmin = await this.db.prisma.user.findFirst({
        
    })
  }

  async createAdmin() {}
}
