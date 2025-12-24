import { Router } from "express";
import authRouter from "./domains/auth/auth.routes";

const apiRoutes = Router();

apiRoutes.use("/auth", authRouter);

export default apiRoutes;
