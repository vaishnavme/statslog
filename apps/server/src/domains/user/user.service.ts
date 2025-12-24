import jwt from "jsonwebtoken";
import { Response } from "express";
import pick from "lodash.pick";
import prisma from "../../lib/db";
import { getHashedPassword } from "../../lib/utils";
import { config } from "../../lib/config";
import { User } from "../../generated/prisma/client";
import idCodecs from "../../lib/id-codec";

const UserService = {
  toDTO: (userRaw: User) => {
    const encodedUser = pick(userRaw, [
      "id",
      "email",
      "createdAt",
      "updatedAt",
    ]);
    return encodedUser;
  },

  create: async ({ email, password }: { email: string; password: string }) => {
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

  createSession: async ({
    userId,
    userAgent,
  }: {
    userId: string;
    userAgent: string;
  }) => {
    const sessionId = idCodecs.sessionId();

    const payload = {
      id: userId,
      sessionId,
      date: Date.now(),
    };

    const sessionToken = jwt.sign(payload, config.jwt_secret!, {
      algorithm: "HS256",
      expiresIn: "7d",
    });

    await prisma.sessions.create({
      data: {
        id: sessionId,
        userId,
        userAgent,
      },
    });

    await UserService.clearOlderSessions(userId);

    return sessionToken;
  },

  setSessionHeaders: (res: Response, token: string) => {
    const expiryDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    res.setHeader("Set-Cookie", [
      `token=${token}; path=/; Secure; SameSite=Strict; HttpOnly; Expires=${expiryDate.toUTCString()}; Priority=High`,
    ]);
  },

  clearOlderSessions: async (userId: string) => {
    const allUserSessions = await prisma.sessions.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    if (allUserSessions.length > 3) {
      const sessionsToDelete = allUserSessions.slice(3);

      await prisma.sessions.deleteMany({
        where: {
          id: {
            in: sessionsToDelete.map((s) => s.id),
          },
        },
      });
    }
  },

  getActiveSession: async ({
    userId,
    sessionId,
  }: {
    userId: string;
    sessionId: string;
  }) => {
    const session = await prisma.sessions.findFirst({
      where: {
        id: sessionId,
        userId,
      },
      include: {
        user: true,
      },
    });

    return session;
  },

  getByEmail: async (email: string) => {
    const user = await prisma.user.findFirst({
      where: { email },
    });

    return user;
  },
};

export default UserService;
