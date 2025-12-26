import express, { Router } from "express";
import cors from "cors";
import asyncHandler from "../../lib/async-handler";

const statsRoute = Router();

statsRoute.use(cors());
statsRoute.use(express.text());

statsRoute.post(
  "/pageview",
  asyncHandler(async (req, res) => {
    let payload = req.body;

    if (typeof payload === "string") {
      try {
        payload = JSON.parse(payload);
      } catch (err) {
        console.error("Failed to parse pageview body", err, payload);
      }
    }

    const ip = req?.ip || "unknown";
    const userAgent = req.headers["user-agent"] || "unknown";

    console.log("Pageview logged:", payload, ip, userAgent);
    res.sendSuccess({ statusCode: 204 });
  })
);

export default statsRoute;
