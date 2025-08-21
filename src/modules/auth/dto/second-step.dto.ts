import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
  IsArray,
} from "class-validator";
import { Type } from "class-transformer";

export class SecondStepDto {
  @IsString()
  @IsNotEmpty()
  question_id: string;

  @IsOptional()
  @IsString()
  answer_text?: string;

  @IsString()
  @IsNotEmpty()
  option_id?: string;
}

export class ThirdStepDto {
  @IsString()
  @IsNotEmpty()
  question_id: string;

  @IsOptional()
  @IsString()
  answer_text?: string;

  @IsOptional()
  @IsString()
  option_id?: string;
}

export class FourthStepDto {
  @IsArray()
  @IsEmail({}, { each: true })
  emails: string[];
}

export class SignUpDto {
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  phone: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SecondStepDto)
  secondStepData: SecondStepDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ThirdStepDto)
  thirdStepData: ThirdStepDto[];

  @ValidateNested()
  @Type(() => FourthStepDto)
  fourthStepData: FourthStepDto;
}
