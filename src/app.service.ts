import { Injectable } from '@nestjs/common';
import { OtpService } from './modules/auth/otp.service';

@Injectable()
export class AppService {
  getHello(): string {
    return '';
  }
}
