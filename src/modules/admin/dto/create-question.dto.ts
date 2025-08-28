import { QuestionType } from '@prisma/client';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

interface IOptions {
  option_text: string;
  option_value: string;
}

export class CreateQuestionDto {
  @IsString()
  question_text: string;
  @IsEnum(QuestionType)
  question_type: QuestionType;
  @IsBoolean()
  @IsOptional()
  is_required: Boolean;
  @IsNumber()
  step_number: number;
  @IsArray()
  @IsOptional()
  options: Array<IOptions>;
}
