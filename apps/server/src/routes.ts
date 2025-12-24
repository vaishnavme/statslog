import { Router } from "express";
import authRouter from "./domains/auth/auth.routes";

const appRoutes = Router();

appRoutes.use("/auth", authRouter);

export default appRoutes;
