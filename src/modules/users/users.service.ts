import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { PrismaService } from "src/core/database/prisma.service";
import { S3Service } from "src/core/storage/s3/s3Service";
import bcrypt from "bcrypt";
@Injectable()
export class UsersService {
  constructor(
    private db: PrismaService,
    private s3: S3Service
  ) {}
  async update(file: Express.Multer.File) {
    const fileName = await this.s3.uploadFile(file, "images");
    const signedUrl = await this.s3.getFileUrl(fileName);
    return { url: signedUrl };
  }

  async checkEmail(email: string) {
    const emailExists = await this.db.prisma.user.findFirst({
      where: {
        email,
      },
    });
    return emailExists ? true : false;
  }
}
