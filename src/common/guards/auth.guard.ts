import {
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "src/core/database/prisma.service";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly reflector: Reflector,
    private readonly db: PrismaService
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.cookies.token;
    const handler = context.getHandler();
    const handlerClass = context.getClass();
    const isFreeAuthClass = this.reflector.get("isFreeAuth", handlerClass);
    const isFreeAuth = this.reflector.get("isFreeAuth", handler);
    if (isFreeAuth || isFreeAuthClass) return true;
    try {
      let { userId } = await this.jwtService.verifyAsync(token);
      const user = await this.db.prisma.user.findFirst({
        where: { id: userId },
      });
      if (!user) throw new NotFoundException("User not found");
      request.userId = userId;
      return true;
    } catch (error) {
      throw new UnauthorizedException("Token invalid");
    }
  }
}
