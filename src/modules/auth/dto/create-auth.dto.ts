import { IsEmail, IsString, IsStrongPassword } from "class-validator";

export class LoginAuthDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}
