import jwt, { JwtPayload } from "jsonwebtoken";
import bcrypt from "bcrypt";
import { Request, Response } from "express";
import idCodecs from "../../lib/id-codec";
import { config } from "../../lib/config";
import prisma from "../../lib/db";
import { AuthSession, User } from "../../generated/prisma/client";

const AuthService = {
  authSessionExpiryAfterDate: (): Date =>
    new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days

  getHashedPassword: async (plainText: string): Promise<string> => {
    const saltRound = 10;
    const hashed = await bcrypt.hash(plainText, saltRound);

    return hashed;
  },

  verifyPasswordHash: async (
    hashedPassword: string,
    plainText: string
  ): Promise<boolean> => {
    return await bcrypt.compare(plainText, hashedPassword);
  },

  createSession: async ({
    userId,
    userAgent,
  }: {
    userId: string;
    userAgent: string;
  }): Promise<string> => {
    const sessionId = idCodecs.authSessionId();

    const payload = {
      id: userId,
      sessionId,
      date: Date.now(),
    };

    const sessionToken = jwt.sign(payload, config.jwt_secret!, {
      algorithm: "HS256",
      expiresIn: "7d",
    });

    await prisma.authSession.create({
      data: {
        id: sessionId,
        userId,
        userAgent,
        expiresAt: AuthService.authSessionExpiryAfterDate(),
      },
    });

    await AuthService.clearOlderSessions(userId);

    return sessionToken;
  },

  setSessionHeaders: (res: Response, token: string): void => {
    const expiryDate = AuthService.authSessionExpiryAfterDate();

    res.setHeader("Set-Cookie", [
      `token=${token}; path=/; Secure; SameSite=Strict; HttpOnly; Expires=${expiryDate.toUTCString()}; Priority=High`,
    ]);
  },

  getUserSessionFromToken: async (
    req: Request
  ): Promise<(User & { sessionId: string }) | null> => {
    const token = req?.cookies?.token;

    if (!token) {
      return null;
    }

    const decoded = jwt.verify(token, config.jwt_secret!) as JwtPayload;

    if (!decoded?.id || !decoded?.sessionId) {
      return null;
    }

    const session = await AuthService.getActiveSession({
      userId: decoded.id,
      sessionId: decoded.sessionId,
    });

    if (!session) {
      return null;
    }

    return {
      ...session.user,
      sessionId: decoded.sessionId,
    };
  },

  clearOlderSessions: async (userId: string): Promise<void> => {
    const allUserSessions = await prisma.authSession.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    if (allUserSessions.length > 3) {
      const sessionsToDelete = allUserSessions.slice(3);

      await prisma.authSession.deleteMany({
        where: {
          id: {
            in: sessionsToDelete.map((s) => s.id),
          },
        },
      });
    }
  },

  deleteSession: async ({
    userId,
    sessionId,
  }: {
    userId: string;
    sessionId: string;
  }): Promise<void> => {
    await prisma.authSession.delete({
      where: {
        id: sessionId,
        userId,
      },
    });
  },

  getActiveSession: async ({
    userId,
    sessionId,
  }: {
    userId: string;
    sessionId: string;
  }): Promise<(AuthSession & { user: User }) | null> => {
    const session = await prisma.authSession.findFirst({
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
};

export default AuthService;
