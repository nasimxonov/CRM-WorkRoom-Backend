import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpException,
  Post,
  Put,
  Req,
  Res,
  UseGuards,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { SendOtpDto } from "./dto/send-otp.dto";
import { VerifySmsCodeDto } from "./dto/verify.sms.code.dto";
import { LoginAuthDto } from "./dto/create-auth.dto";
import { Request, Response } from "express";
import { SignUpDto } from "./dto/second-step.dto";
import { AuthGuard } from "src/common/guards/auth.guard";
import { updateUserDataDto } from "./dto/updateUserData.dto";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post("send-otp")
  @HttpCode(200)
  async sendOtp(@Body() body: SendOtpDto) {
    try {
      console.log(111);
      return await this.authService.sendOtp(body);
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }
  @Post("verify-otp")
  @HttpCode(200)
  async verifyOtp(
    @Body() body: VerifySmsCodeDto,
    @Res({ passthrough: true }) res: Response
  ) {
    const { phone_number, code } = body;
    try {
      const data = await this.authService.verifyOtp(phone_number, code);
      res.cookie("sessionToken", data.sessionToken, {
        httpOnly: true,
        path: "/",
        maxAge: 3660,
        secure: false,
        sameSite: "lax",
      });

      return { message: data.message };
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  @Post("register")
  @HttpCode(200)
  async register(
    @Body() data: SignUpDto,
    @Res({ passthrough: true }) res: Response,
    @Req() req: Request
  ) {
    try {
      const sessionToken = req.cookies["sessionToken"];
      const token = await this.authService.register(data, sessionToken);
      res.cookie("token", token, {
        httpOnly: true,
        path: "/",
        maxAge: 3600 * 2,
        secure: false,
        sameSite: "lax",
      });
      return { token };
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  @Post("login")
  @HttpCode(200)
  async login(
    @Body() loginAuthDto: LoginAuthDto,
    @Res({ passthrough: true }) res: Response
  ) {
    const token = await this.authService.login(loginAuthDto);

    res.cookie("token", token, {
      httpOnly: true,
      path: "/",
      maxAge: 24 * 60 * 60 * 1000,
      secure: false,
      sameSite: "lax",
    });

    return { token };
  }

  @UseGuards(AuthGuard)
  @Get("me")
  async me(@Req() req: Request) {
    try {
      const userId = req["userId"];
      const user = await this.authService.me(userId);
      return { user };
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  @UseGuards(AuthGuard)
  @Get("workload")
  async getWorkload(@Req() req: Request) {
    const userId = req["userId"];
    console.log("jnxnjsxmk");
    const workloads = await this.authService.getWorkload(userId);
    return workloads;
  }

  @Get("check")
  async check(@Req() req: Request) {
    console.log("ssxsxsxwqxsax");
    const token = req.cookies["token"];
    console.log(token);
    if (!token) return false;
    return true;
  }

  @Post("logout")
  async logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie("token");
    return {
      message: "Successfully logged out",
    };
  }

  @UseGuards(AuthGuard)
  @Put("update")
  async updateUserData(
    @Res({ passthrough: true }) res: Response,
    @Req() req: Request,
    @Body() data: updateUserDataDto
  ) {
    try {
      console.log("updatega keldi");
      const userId = req["userId"];
      console.log(userId, "userId");
      const newData = await this.authService.updateUserData(data, userId);
      return newData;
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }
}
