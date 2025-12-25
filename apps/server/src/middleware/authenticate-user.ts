import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import error_messages from "../lib/errors-messages";
import { config } from "../lib/config";
import AuthService from "../domains/auth/auth.service";

const authenticateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req?.cookies?.token;

  if (!token) {
    return res.sendError(error_messages.auth.invalid_access);
  }

  try {
    const decoded = jwt.verify(token, config.jwt_secret!) as JwtPayload;

    if (!decoded?.id || !decoded?.sessionId) {
      return res.sendError(error_messages.auth.invalid_access);
    }

    const session = await AuthService.getActiveSession({
      userId: decoded.id,
      sessionId: decoded.sessionId,
    });

    if (!session) {
      return res.sendError(error_messages.auth.invalid_access);
    }

    req.user = {
      ...session.user,
      sessionId: decoded.sessionId,
    };

    next();
  } catch {
    return res.sendError(error_messages.auth.invalid_access);
  }
};

export default authenticateUser;
