import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { SendOtpDto } from "./dto/send-otp.dto";
import { OtpService } from "./otp.service";
import { LoginAuthDto } from "./dto/create-auth.dto";
import bcrypt from "bcrypt";
import { PrismaService } from "src/core/database/prisma.service";
import { JwtService } from "@nestjs/jwt";
import { SignUpDto } from "./dto/second-step.dto";
import { S3Service } from "src/core/storage/s3/s3Service";
import { updateUserDataDto } from "./dto/updateUserData.dto";

@Injectable()
export class AuthService {
  constructor(
    private otpService: OtpService,
    private db: PrismaService,
    private jwt: JwtService,
    private s3: S3Service
  ) {}
  async sendOtp(body: SendOtpDto) {
    const { phone_number } = body;
    const data = await this.otpService.sendSms(phone_number);
    return data;
  }
  async verifyOtp(phone_number: string, code: string) {
    await this.otpService.isBlockedUser(phone_number);
    const sessionToken = await this.otpService.verifyOtpCode(
      phone_number,
      code
    );
    return {
      message: "success",
      sessionToken,
    };
  }

  async register(data: SignUpDto, sessionToken: string) {
    const findUser = await this.db.prisma.user.findUnique({
      where: { email: data.email },
    });
    const findByPhoneUser = await this.db.prisma.user.findUnique({
      where: { phone_number: data.phone },
    });
    if (findUser || findByPhoneUser)
      throw new ConflictException("Email or phone_number already exists");
    const key = `session:${data.phone}`;
    await this.otpService.checkTokenUser(key, sessionToken);
    const hashedPassword = await bcrypt.hash(data.password, 12);
    const user = await this.db.prisma.user.create({
      data: {
        username: data.email,
        email: data.email,
        phone_number: data.phone,
        password: hashedPassword,
      },
    });
    const allAnswers = [
      ...(data.secondStepData || []),
      ...(data.thirdStepData || []),
    ];
    for (const ans of allAnswers) {
      const userAnswer = await this.db.prisma.userProfileQuestionAnswers.create(
        {
          data: {
            question_id: ans.question_id,
            user_id: user.id,
            answer_text: ans.answer_text ?? null,
          },
        }
      );
      if (ans.option_id) {
        await this.db.prisma.selectedAnswerOptions.create({
          data: {
            answer_id: userAnswer.id,
            option_id: ans.option_id,
          },
        });
      }
    }
    if (data.fourthStepData?.emails?.length) {
      for (const email of data.fourthStepData.emails) {
        const existUser = await this.db.prisma.user.findUnique({
          where: { email },
        });
        await this.db.prisma.userMember.create({
          data: {
            email,
            user_id: existUser ? existUser.id : null,
            memberedId: user.id,
          },
        });
      }
    }
    await this.otpService.delTokenUser(key);
    const token = await this.jwt.signAsync({ userId: user.id });
    return token;
  }

  async login(loginAuthDto: LoginAuthDto) {
    const findEmail = await this.db.prisma.user.findUnique({
      where: {
        email: loginAuthDto.email,
      },
    });

    if (!findEmail) throw new NotFoundException("Email or password incorrect");

    const comparePassword = await bcrypt.compare(
      loginAuthDto.password,
      findEmail.password
    );

    if (!comparePassword)
      throw new NotFoundException("Email or password incorrect");

    const token = await this.jwt.signAsync({ userId: findEmail.id });

    return token;
  }

  async me(userId: string) {
    const findUser = await this.db.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    if (!findUser) throw new NotFoundException("User not found");
    if (findUser.fileName) {
      const img_url = await this.s3.getFileUrl(findUser.fileName);
      return {
        ...findUser,
        img_url,
      };
    }
    return findUser;
  }

  async getWorkload(userId: string) {
    const findUser = await this.db.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    if (!findUser) throw new NotFoundException("User not found");
    const members = await this.db.prisma.userMember.findMany({
      where: {
        memberedId: userId,
      },
      take: 4,
      include: {
        user: true,
      },
    });
    if (members && members.length > 0) {
      const updatedMembers: Array<any> = [];
      for (const member of members) {
        const fileName = member.user?.fileName;
        if (fileName) {
          const img_url = await this.s3.getFileUrl(fileName);
          updatedMembers.push({ ...member, img_url });
        } else {
          updatedMembers.push(member);
        }
      }
      return { updatedMembers };
    }
    return { members };
  }

  async updateUserData(data: updateUserDataDto, userId: string) {
    const user = await this.db.prisma.user.findFirst({
      where: {
        id: userId,
      },
    });
    if (!user) throw new NotFoundException("User not found");
    const newUserData = await this.db.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        ...data,
      },
    });
    return newUserData;
  }
}
