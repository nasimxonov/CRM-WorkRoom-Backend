import { IsPhoneNumber, IsString } from 'class-validator';
export class VerifySmsCodeDto {
  @IsString()
  @IsPhoneNumber('UZ')
  phone_number: string;
  @IsString()
  code: string;
}
