import express, { Router } from "express";
import cors from "cors";
import asyncHandler from "../../lib/async-handler";
import StatsService from "./stats.service";
import ProjectService from "../project/project.service";

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

    if (!payload?.appId) {
      return res.sendError({ message: "AppId is required", code: 400 });
    }

    const project = await ProjectService.getProjectByAppId(payload.appId);
    if (!project) {
      return res.sendError({ message: "Invalid project", code: 400 });
    }

    const ip = req?.ip || "unknown";
    const userAgent = req?.headers?.["user-agent"]
      ? StatsService.getVistorDeviceInfo(req.headers["user-agent"] as string)
      : undefined;

    const visitor = await StatsService.createVisitor({
      projectId: project.id,
      anonymousId: payload.visitorId,
    });

    const session = await StatsService.createSession({
      projectId: project.id,
      visitorId: visitor.id,
      sessionId: payload.sessionId,
      userAgent,
    });

    await StatsService.createPageView({
      projectId: project.id,
      sessionId: session.id,
      visitorId: visitor.id,
      path: payload.path,
      title: payload?.title,
    });

    res.status(204).end();
  })
);

export default statsRoute;
