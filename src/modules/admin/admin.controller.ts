import {
  Body,
  Controller,
  Get,
  HttpException,
  Post,
  Query,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateQuestionDto } from './dto/create-question.dto';
import { QuestionAnswer } from './dto/question-answer.dto';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post('user-profile/create/question')
  async createQuestion(@Body() createQuestionDto: CreateQuestionDto) {
    try {
      return await this.adminService.createQuestion(createQuestionDto);
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }
  @Get('questions')
  async getQuestions(@Query('step_number') step_number: string) {
    try {
      return await this.adminService.getQuestions(+step_number);
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  @Post('question-answer')
  async questionAnswer(@Body() questionAnswer: QuestionAnswer) {
    try {
      return await this.adminService.addAnswerQuestion(questionAnswer);
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }
}
