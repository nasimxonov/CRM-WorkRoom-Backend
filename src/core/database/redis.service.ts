import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
@Injectable()
export class RedisService implements OnModuleInit {
  public redis: Redis;
  public logger: Logger = new Logger(RedisService.name);
  constructor(private configService: ConfigService) {
    this.redis = new Redis({
      host: this.configService.get('REDIS_HOST'),
      port: +this.configService.get('REDIS_PORT'),
    });
  }
  async onModuleInit() {
    try {
      this.redis.on('error', (err) => {
        throw new Error(err.message);
      });
      this.redis.on('connect', () => {
        this.logger.log('Redis connected');
      });
    } catch (error) {
      this.redis.disconnect();
      this.logger.error('Redis disconnected');
    }
  }
  async addKey(key: string, value: string, expire: number) {
    await this.redis.setex(key, expire, value);
  }
  async delKey(key: string) {
    await this.redis.del(key);
  }
  async getKeyValue(key: string) {
    const value = await this.redis.get(key);
    return value;
  }
  async getTTLKey(key: string) {
    const ttl = await this.redis.ttl(key);
    return ttl;
  }
  async setExpireKey(key: string, expire: number) {
    await this.redis.expire(key, expire);
  }
  async incrementKey(key: string) {
    await this.redis.incr(key);
  }
}
