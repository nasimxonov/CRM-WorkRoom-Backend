import { Injectable } from '@nestjs/common';
import { CreateQuestionDto } from './dto/create-question.dto';
import { PrismaService } from 'src/core/database/prisma.service';
import { QuestionAnswer } from './dto/question-answer.dto';

@Injectable()
export class AdminService {
  constructor(private db: PrismaService) {}
  async createQuestion(createQuestionDto: CreateQuestionDto) {
    const question = await this.db.prisma.userProfileQuestions.create({
      data: {
        question_text: createQuestionDto.question_text,
        question_type: createQuestionDto.question_type,
        is_required: createQuestionDto.is_required ? true : false,
        step_number: createQuestionDto.step_number,
      },
    });
    if (createQuestionDto?.options.length >= 1) {
      const options = createQuestionDto.options.map(
        ({ option_text, option_value }) => {
          return this.db.prisma.questionOptions.create({
            data: {
              question_id: question.id,
              option_text,
              option_value,
            },
          });
        },
      );
      await Promise.all([...options]);
    }
    return {
      message: 'success',
      question_id: question.id,
    };
  }
  async getQuestions(step_number: number) {
    const questions = await this.db.prisma.userProfileQuestions.findMany({
      where: {
        step_number,
      },
      include: {
        options: true,
      },
    });
    return questions;
  }

  async addAnswerQuestion(questionAnswer: QuestionAnswer) {
    await this.db.prisma.userProfileQuestionAnswers.create({
      data: {
        answer_text: questionAnswer.answer_text,
        question_id: questionAnswer.question_id,
      },
    });
    if (questionAnswer?.answer_options) {
      const answerOptions = questionAnswer.answer_options.map(
        ({ answer_id, option_id }) => {
          return this.db.prisma.selectedAnswerOptions.create({
            data: {
              option_id,
              answer_id,
            },
          });
        },
      );
      await Promise.all([...answerOptions]);
      return {
        message: 'Answers added',
      };
    }
  }
}
