import express from "express";
import { env } from "./lib/config";
import errorHandler from "./middleware/error-handler";
import responseHandler from "./middleware/response-handler";

const app = express();
app.use(express.json());
app.use(responseHandler);

app.use((req, res) => {
  res.sendError({
    message: `Cannot ${req.method} ${req.originalUrl}`,
    code: 404,
  });
});

app.use(errorHandler);

app.listen(env.port, () => {
  console.log(`Server is running on port http://localhost:${env.port}`);
});
