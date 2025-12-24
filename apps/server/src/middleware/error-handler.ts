import { Request, Response, NextFunction } from "express";
import CustomError from "../lib/custom-error";

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

  console.error("Unhandled Error:", err);

  res.status(500).json({
    success: false,
    error: {
      message: "Internal Server Error",
    },
  });
}

export default errorHandler;
