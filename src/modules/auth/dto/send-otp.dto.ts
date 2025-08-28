import { IsString } from 'class-validator';

export class SendOtpDto {
  @IsString()
  phone_number: string;
}
