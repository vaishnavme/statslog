import { Router } from "express";
import asyncHandler from "../../lib/async-handler";
import error_messages from "../../lib/errors-messages";
import { isValidEmail } from "../../lib/utils";

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
  })
);

export default authRouter;
