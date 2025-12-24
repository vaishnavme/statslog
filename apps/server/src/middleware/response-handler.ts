import { Request, Response, NextFunction } from "express";
import { User } from "../generated/prisma/client";

interface ErrorResponseOptions {
  code?: number;
  message?: string;
  data?: any;
}

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
    interface Response {
      sendSuccess<T>(data: T, statusCode?: number, message?: string): Response;
      sendError(options: ErrorResponseOptions): Response;
    }
  }
}

function responseHandler(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  res.sendSuccess = function <T>(
    data: T,
    statusCode = 200,
    message = ""
  ): Response {
    const resObj: Record<string, any> = {
      success: true,
      data,
    };
    if (message) resObj.message = message;
    return res.status(statusCode).json(resObj);
  };

  res.sendError = function ({
    code = 500,
    message = "Internal server error!",
    data,
  }: ErrorResponseOptions): Response {
    return res.status(code).json({
      success: false,
      data,
      error: {
        message,
      },
    });
  };

  next();
}

export default responseHandler;
