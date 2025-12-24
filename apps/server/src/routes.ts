import { Router } from "express";
import authRouter from "./domains/auth/auth.routes";
import projectRoute from "./domains/project/project.route";

import authenticateUser from "./middleware/authenticate-user";

const apiRoutes = Router();

apiRoutes.use("/auth", authRouter);
apiRoutes.use("/project", authenticateUser, projectRoute);

export default apiRoutes;
