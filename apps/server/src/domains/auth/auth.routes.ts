import { Router } from "express";
import asyncHandler from "../../lib/async-handler";
import error_messages from "../../lib/errors-messages";
import { isValidEmail, verifyPasswordHash } from "../../lib/utils";
import UserService from "../user/user.service";
import CustomError from "../../lib/custom-error";
import authenticateUser from "../../middleware/authenticate-user";

const authRouter = Router();

// signup
authRouter.post(
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

    const sessionToken = await UserService.createSession({
      userId: user.id,
      userAgent: req.headers["user-agent"] || "unknown",
    });

    UserService.setSessionHeaders(res, sessionToken);

    res.sendSuccess({ user: UserService.toDTO(user) });
  })
);

authRouter.post(
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

    const isPasswordValid = await verifyPasswordHash(
      user.password,
      data.password
    );

    if (!isPasswordValid) {
      throw new CustomError(error_messages.auth.invalid_email_or_password);
    }

    const sessionToken = await UserService.createSession({
      userId: user.id,
      userAgent: req.headers["user-agent"] || "unknown",
    });

    UserService.setSessionHeaders(res, sessionToken);

    res.sendSuccess({ user: UserService.toDTO(user) });
  })
);

authRouter.post(
  "/logout",
  authenticateUser,
  asyncHandler(async (req, res) => {
    const user = req?.user;

    await UserService.deleteSession({
      userId: user?.id!,
      sessionId: user?.sessionId!,
    });

    res.clearCookie("token", {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      path: "/",
    });

    res.sendSuccess({
      message: "Logged out successfully",
    });
  })
);

export default authRouter;
