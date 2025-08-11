import { Injectable } from '@nestjs/common';
import { SendOtpDto } from './dto/send-otp.dto';
import { OtpService } from './otp.service';

@Injectable()
export class AuthService {
  constructor(private otpService: OtpService) {}
  async sendOtp(body: SendOtpDto) {
    const { phone_number } = body;
    const data = await this.otpService.sendSms(phone_number);
    return data;
  }
  async verifyOtp(phone_number: string, code: string) {
    await this.otpService.isBlockedUser(phone_number);
    await this.otpService.verifyOtpCode(phone_number, code);
    return {
      message: 'success',
    };
  }
  async register() {}
  async login() {}
  async logout() {}
}
