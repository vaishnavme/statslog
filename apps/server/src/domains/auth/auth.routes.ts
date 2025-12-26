import { Router } from "express";
import asyncHandler from "../../lib/async-handler";
import error_messages from "../../lib/errors-messages";
import { isValidEmail } from "../../lib/utils";
import UserService from "../user/user.service";
import CustomError from "../../lib/custom-error";
import authenticateUser from "../../middleware/authenticate-user";
import AuthService from "./auth.service";

const authRoute = Router();

authRoute.post(
  "/signup",
  asyncHandler(async (req, res) => {
    const data = req.body;

    if (!data.email?.trim().length) {
      return res.sendError(error_messages.auth.empty_email);
    }

    if (!data.password?.trim().length) {
      return res.sendError(error_messages.auth.empty_password);
    }

    if (!isValidEmail(data.email)) {
      return res.sendError(error_messages.auth.invalid_email);
    }

    const existingUser = await UserService.getByEmail(data.email);

    if (existingUser) {
      throw new CustomError(error_messages.auth.email_exists);
    }

    const user = await UserService.create({
      email: data.email,
      password: data.password,
    });

    const sessionToken = await AuthService.createSession({
      userId: user.id,
      userAgent: req.headers["user-agent"] || "unknown",
    });

    AuthService.setSessionHeaders(res, sessionToken);

    res.sendSuccess({ user: UserService.toDTO(user) });
  })
);

authRoute.post(
  "/login",
  asyncHandler(async (req, res) => {
    const data = req.body;

    if (!data.email?.trim().length) {
      return res.sendError(error_messages.auth.empty_email);
    }

    if (!data.password?.trim().length) {
      return res.sendError(error_messages.auth.empty_password);
    }

    const user = await UserService.getByEmail(data.email);

    if (!user) {
      throw new CustomError(error_messages.auth.invalid_email_or_password);
    }

    const isPasswordValid = await AuthService.verifyPasswordHash(
      user.password,
      data.password
    );

    if (!isPasswordValid) {
      throw new CustomError(error_messages.auth.invalid_email_or_password);
    }

    const sessionToken = await AuthService.createSession({
      userId: user.id,
      userAgent: req.headers["user-agent"] || "unknown",
    });

    AuthService.setSessionHeaders(res, sessionToken);

    res.sendSuccess({ user: UserService.toDTO(user) });
  })
);

authRoute.post(
  "/logout",
  authenticateUser,
  asyncHandler(async (req, res) => {
    const user = req?.user;

    await AuthService.deleteSession({
      userId: user!.id,
      sessionId: user!.sessionId,
    });

    res.setHeader(
      "Set-Cookie",
      "token=; Max-Age=0; Path=/; HttpOnly; Secure; SameSite=Strict"
    );

    res.sendSuccess({
      message: "Logged out successfully",
    });
  })
);

export default authRoute;
