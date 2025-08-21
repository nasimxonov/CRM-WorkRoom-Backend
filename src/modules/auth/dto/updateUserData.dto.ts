import { IsEmail, IsString, IsStrongPassword } from "class-validator";

export class updateUserDataDto {
  @IsEmail()
  email: string;
  @IsString()
  position: string;
  @IsString()
  @IsString()
  level: string;
  company: string;
  @IsString()
  phone_number: string;
}
