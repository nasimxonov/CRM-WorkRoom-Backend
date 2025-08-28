import { IsOptional, IsString } from 'class-validator';

interface IAnswerOptions {
  answer_id: string;
  option_id: string;
}

export class QuestionAnswer {
  @IsString()
  question_id: string;
  @IsString()
  answer_text: string;
  @IsOptional()
  answer_options: Array<IAnswerOptions>;
}
