import express from "express";
import { env } from "./lib/config";

const app = express();
app.use(express.json());

app.listen(env.port, () => {
  console.log(`Server is running on port http://localhost:${env.port}`);
});
