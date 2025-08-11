import {
  Body,
  Controller,
  HttpCode,
  HttpException,
  Post,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SendOtpDto } from './dto/send-otp.dto';
import { VerifySmsCodeDto } from './dto/verify.sms.code.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('send-otp')
  @HttpCode(200)
  async sendOtp(@Body() body: SendOtpDto) {
    try {
      return await this.authService.sendOtp(body);
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }
  @Post('verify-otp')
  @HttpCode(200)
  async verifyOtp(@Body() body: VerifySmsCodeDto) {
    const { phone_number, code } = body;
    try {
      return await this.authService.verifyOtp(phone_number, code);
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }
  @Post()
  async register() {}
  @Post()
  async login() {}
  @Post()
  async logout() {}
}
