import {
  CanActivate,
  ExecutionContext,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly jwt: JwtService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const classHandler = context.getClass();

    const functionHandler = context.getHandler();

    const isPublic = this.reflector.getAllAndOverride('isPublic', [
      functionHandler,
      classHandler,
    ]);

    if (isPublic) return true;

    try {
      const { token } = request.cookies;

      const { userId } = await this.jwt.verifyAsync(token);

      request.userId = userId;

      return true;
    } catch (error) {
      throw new InternalServerErrorException('token topilmadi');
    }
  }
}
