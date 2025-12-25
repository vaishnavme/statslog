import { Router } from "express";
import asyncHandler from "../../lib/async-handler";

const statsRoute = Router();

statsRoute.post(
  "/pageview",
  asyncHandler(async (req, res) => {
    const data = req.body;
  })
);

export default statsRoute;
