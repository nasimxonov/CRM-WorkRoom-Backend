// import {
//   CanActivate,
//   ExecutionContext,
//   ForbiddenException,
//   Injectable,
// } from "@nestjs/common";
// import { Reflector } from "@nestjs/core";
// import { PrismaService } from "src/core/database/prisma.service";

// @Injectable()
// export class RoleGuard implements CanActivate {
//   constructor(
//     private readonly reflect: Reflector,
//     private readonly db: PrismaService
//   ) {}
//   async canActivate(context: ExecutionContext): Promise<boolean> {
//     const request = context.switchToHttp().getRequest();
//     const userId = request["userId"];
//     const paramId = request.params.id;
//     const user = await this.db.prisma.user.findFirst({ where: { id: userId } });
//     if (!user) return false;
//     const handler = context.getHandler();
//     const handClass = context.getClass();
//     const roles =
//       this.reflect.get("roles", handler) ??
//       this.reflect.get("roles", handClass);
//     if (roles.includes(user.role)) {
//       return true;
//     } else if (roles.includes("owner") && userId == paramId) {
//       return true;
//     } else {
//       throw new ForbiddenException("Forbidden resource");
//     }
//   }
// }
