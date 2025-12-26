import express from "express";
import cookieParser from "cookie-parser";
import responseHandler from "./middleware/response-handler";
import apiRoutes from "./routes";
import errorHandler from "./middleware/error-handler";
import { config } from "./lib/config";
import scriptRoute from "./domains/script/script.service";

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(responseHandler);

app.get("/statslog.js", scriptRoute);
app.use("/api/v1", apiRoutes);

app.use((req, res) => {
  res.sendError({
    message: `Cannot ${req.method} ${req.originalUrl}`,
    code: 404,
  });
});

app.use(errorHandler);

app.listen(config.port, () => {
  console.log(`Server is running on port http://localhost:${config.port}`);
});
