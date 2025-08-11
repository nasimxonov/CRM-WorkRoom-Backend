import { BadRequestException, Injectable } from '@nestjs/common';
import { RedisService } from 'src/core/database/redis.service';
import { EskizService } from './eskiz.service';
import generateOtp from 'src/utils/generate-otp';
@Injectable()
export class OtpService {
  private ttlExpireOtp: number = 60;
  private hourlyTTLExpireOtp: number = 3600;
  private hourlyOtpAttempts = 10;
  private maxFailedOtpAttempt: number = 5;
  constructor(
    private redisService: RedisService,
    private eskizService: EskizService,
  ) {}

  async canSmsRequest(phone_number: string) {
    const key = `sms:otp:${phone_number}:code`;
    const keyExists = await this.redisService.redis.exists(key);
    if (keyExists) {
      const ttl = await this.redisService.getTTLKey(key);
      throw new BadRequestException(`Please try again later ${ttl}`);
    }
  }

  async sendSms(phone_number: string) {
    await this.isBlockedUser(phone_number);
    await this.canSmsRequest(phone_number);
    await this.checkSmsLimit(phone_number);
    const otpCode = generateOtp();
    await this.eskizService.sendSms(phone_number, otpCode);
    const key = `sms:otp:${phone_number}:code`;
    await this.redisService.addKey(key, otpCode, this.ttlExpireOtp);
    await this.trackSmsRequest(phone_number);
    return {
      message: 'otp sended',
    };
  }
  async checkSmsLimit(key: string) {
    const otpKeyHourly = `sms:otp:${key}:limit:hourly`;
    const valueOtpHourly = await this.redisService.getKeyValue(otpKeyHourly);
    if (valueOtpHourly && +valueOtpHourly > this.hourlyOtpAttempts)
      throw new BadRequestException('otp hourly limit reached');
  }
  async trackSmsRequest(key: string) {
    const keyOtpHourly = `sms:otp:${key}:limit:hourly`;
    await this.redisService.incrementKey(keyOtpHourly);
    await this.redisService.setExpireKey(keyOtpHourly, this.hourlyTTLExpireOtp);
  }
  async recordFailedAttempts(phone_number: string) {
    const keyFailedAttempts = `sms:otp:${phone_number}:failed:attempts`;
    const existsKeyFailedAttempts =
      await this.redisService.redis.exists(keyFailedAttempts);
    await this.redisService.incrementKey(keyFailedAttempts);
    if (!existsKeyFailedAttempts) {
      await this.redisService.setExpireKey(keyFailedAttempts, 300);
    }
    const value = await this.redisService.getKeyValue(keyFailedAttempts);
    if (+(value as string) >= this.maxFailedOtpAttempt) {
      const keyBlockedUser = `sms:otp:${phone_number}:blocked`;
      await this.redisService.addKey(
        keyBlockedUser,
        JSON.stringify({
          reason: 'Max Otp Attempts',
          blockedAt: new Date(),
          unblockAt: new Date().setMinutes(5),
        }),
        300,
      );
      await this.redisService.delKey(keyFailedAttempts);
    }
  }

  async verifyOtpCode(phone_number: string, code: string) {
    const key = `sms:otp:${phone_number}:code`;
    const value = await this.redisService.getKeyValue(key);
    if (value !== code) {
      await this.recordFailedAttempts(phone_number);
      throw new BadRequestException({
        message: 'wrong otp password',
      });
    }
    await this.redisService.delKey(key);
    await this.redisService.delKey(`sms:otp:${phone_number}:failed:attempts`);
  }
  async isBlockedUser(phone_number: string) {
    const keyBlockedUser = `sms:otp:${phone_number}:blocked`;
    const value = await this.redisService.getKeyValue(keyBlockedUser);
    const ttl = await this.redisService.getTTLKey(keyBlockedUser);
    if (value)
      throw new BadRequestException({
        message: `You blocked! Please try again after ${ttl}`,
      });
  }
}
