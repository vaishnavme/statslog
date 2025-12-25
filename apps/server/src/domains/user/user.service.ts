import jwt from "jsonwebtoken";
import { Response } from "express";
import pick from "lodash.pick";
import prisma from "../../lib/db";
import { getHashedPassword } from "../../lib/utils";
import { config } from "../../lib/config";
import { User, AuthSession } from "../../generated/prisma/client";
import idCodecs from "../../lib/id-codec";

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
    const hashedPassword = await getHashedPassword(password);

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
};

export default UserService;
