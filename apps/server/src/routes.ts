import { Router } from "express";
import authRoute from "./domains/auth/auth.routes";
import projectRoute from "./domains/project/project.route";

import authenticateUser from "./middleware/authenticate-user";
import statsRoute from "./domains/stats/stats.route";
import userRoute from "./domains/user/user.route";

const apiRoutes = Router();

apiRoutes.use("/auth", authRoute);
apiRoutes.use("/user", authenticateUser, userRoute);
apiRoutes.use("/project", projectRoute);
apiRoutes.use("/stats", statsRoute);

export default apiRoutes;
