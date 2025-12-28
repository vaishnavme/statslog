import { Router } from "express";
import asyncHandler from "../../lib/async-handler";
import UserService from "./user.service";

const userRoute = Router();

userRoute.get(
  "/me",
  asyncHandler(async (req, res) => {
    const user = req.user;

    return res.sendSuccess({ user: UserService.toDTO(user!) });
  })
);

userRoute.delete(
  "/",
  asyncHandler(async (req, res) => {
    const user = req.user;

    await UserService.deleteUser(user!.id);

    return res.sendSuccess({ message: "User deleted successfully" });
  })
);

export default userRoute;
