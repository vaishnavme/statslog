import pick from "lodash.pick";
import { User } from "@prisma/client";
import prisma from "../../lib/db";
import idCodecs from "../../lib/id-codec";
import AuthService from "../auth/auth.service";

const UserService = {
  toDTO: (userRaw: User): Partial<User> => {
    const encodedUser = pick(userRaw, [
      "id",
      "email",
      "createdAt",
      "updatedAt",
    ]);
    return encodedUser;
  },

  create: async ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }): Promise<User> => {
    const hashedPassword = await AuthService.getHashedPassword(password);

    const user = await prisma.user.create({
      data: {
        id: idCodecs.userId(),
        email,
        password: hashedPassword,
      },
    });

    return user;
  },

  getByEmail: async (email: string): Promise<User | null> => {
    const user = await prisma.user.findFirst({
      where: { email },
    });

    return user;
  },

  deleteUser: async (userId: string): Promise<void> => {
    await prisma.user.delete({
      where: { id: userId },
    });
  },
};

export default UserService;
