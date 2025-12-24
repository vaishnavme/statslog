import { Request, Response, NextFunction } from "express";
import CustomError from "../lib/custom-error";
import { isDev } from "../lib/config";

function errorHandler(
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  if (err instanceof CustomError) {
    res.sendError(err);
    return;
  }

  if (isDev()) {
    console.error("Unhandled Error:", err);
  }

  res.status(500).json({
    success: false,
    error: {
      message: "Internal Server Error",
    },
  });
}

export default errorHandler;
