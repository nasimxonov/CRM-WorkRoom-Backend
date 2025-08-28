import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
  UseInterceptors,
  UseGuards,
  Req,
  HttpException,
  UploadedFile,
  HttpCode,
} from "@nestjs/common";
import { UsersService } from "./users.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { FileInterceptor } from "@nestjs/platform-express";
import { AuthGuard } from "src/common/guards/auth.guard";
import { Request } from "express";

@Controller("user")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Put()
  @UseInterceptors(FileInterceptor("file"))
  async update(@Req() req: Request, @UploadedFile() file: Express.Multer.File) {
    try {
      console.log("sorov keldi");
      return this.usersService.update(file);
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  @Post("email-check")
  @HttpCode(200)
  async chechkEmail(@Body() data: { email: string }) {
    console.log("Emailga sorov keldi");
    return await this.usersService.checkEmail(data.email);
  }
}
