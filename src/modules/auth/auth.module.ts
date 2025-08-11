import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { EskizService } from './eskiz.service';
import { OtpService } from './otp.service';

@Module({
  controllers: [AuthController],
  providers: [AuthService, EskizService, OtpService],
})
export class AuthModule {}
