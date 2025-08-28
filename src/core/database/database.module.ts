import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { RedisService } from './redis.service';
import { SeederService } from './seeders/seeder.service';
@Global()
@Module({
  imports: [],
  providers: [PrismaService, RedisService, SeederService],
  exports: [PrismaService, RedisService],
})
export class DatabaseModule {}
