import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/core/database/prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly db: PrismaService) {}
  async me(userId: string) {
    const findUser = await this.db.prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        email: true,
        username: true,
      },
    });

    if (!findUser) throw new NotFoundException('Information not found');

    return findUser;
  }
}
