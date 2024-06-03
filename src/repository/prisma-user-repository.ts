import { Prisma, User } from "@prisma/client";
import { UserRepository } from "../interface/user-repository";
import { prisma } from "../database/prisma";

export class PrismaUserRepository implements UserRepository {
  async create(data: Prisma.UserCreateInput) {
    const user = await prisma.user.create({
      data: data,
    });
    return user;
  }
  async findByEmail(email: string) {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    return user;
  }
}