import { IsEmail, IsString, IsStrongPassword } from 'class-validator';

export class LoginAuthDto {
  @IsEmail()
  email: string;

  //   @IsStrongPassword()
  @IsString()
  password: string;
}
