import { Router } from "express";
import asyncHandler from "../../lib/async-handler";
import error_messages from "../../lib/errors-messages";
import ProjectService from "./project.service";
import authenticateUser from "../../middleware/authenticate-user";
import AuthService from "../auth/auth.service";
import { getTimeRange, Period } from "../../lib/utils";

const projectRoute = Router();

// get all projects for user
projectRoute.get(
  "/",
  authenticateUser,
  asyncHandler(async (req, res) => {
    const user = req?.user;

    const projects = await ProjectService.getAllByUserId(user?.id!);

    res.sendSuccess({ projects });
  })
);

// get project by id
projectRoute.get(
  "/:projectId",
  authenticateUser,
  asyncHandler(async (req, res) => {
    const user = req?.user;
    const { projectId } = req.params;

    if (!projectId) {
      return res.sendError(error_messages.project.id_required);
    }

    const project = await ProjectService.getByUserProjectId({
      userId: user?.id!,
      projectId,
    });

    if (!project) {
      return res.sendError(error_messages.project.not_found);
    }

    res.sendSuccess({ project });
  })
);

// get project by app id
projectRoute.get(
  "/dashboard/:appId",
  asyncHandler(async (req, res) => {
    const { appId } = req.params;
    const period = (req.query.period as Period) ?? "7d";

    const user = await AuthService.getUserSessionFromToken(req);

    if (!appId) {
      return res.sendError(error_messages.project.id_required);
    }

    const project = await ProjectService.getProjectByAppId(appId);

    if (!project) {
      return res.sendError(error_messages.project.not_found);
    }

    // if project is not public, check userId
    if (!project.isPublic && user?.id !== project.userId) {
      return res.sendError(error_messages.project.access_denied);
    }

    const { start, end } = getTimeRange(period);

    const dashboardData = await ProjectService.getProjectVisitorStats({
      projectId: project.id,
      startDate: start,
      endDate: end,
    });

    res.sendSuccess({ project, dashboardData });
  })
);

// update project public access
projectRoute.patch(
  "/:projectId/public-access",
  authenticateUser,
  asyncHandler(async (req, res) => {
    const user = req?.user;
    const { projectId } = req.params;

    if (!projectId) {
      return res.sendError(error_messages.project.id_required);
    }

    const project = await ProjectService.getByUserProjectId({
      userId: user?.id!,
      projectId,
    });

    if (!project) {
      return res.sendError(error_messages.project.not_found);
    }

    const updatedProject = await ProjectService.updatePublicAccess({
      userId: user?.id!,
      projectId,
      currentAccessStatus: project.isPublic,
    });

    res.sendSuccess({ project: updatedProject });
  })
);

// create project
projectRoute.post(
  "/",
  authenticateUser,
  asyncHandler(async (req, res) => {
    const user = req?.user;
    const data = req.body;

    const name = data?.name?.trim();
    const website = data?.website?.trim();

    if (!name?.length) {
      return res.sendError(error_messages.project.name_required);
    }

    if (!website?.length) {
      return res.sendError(error_messages.project.website_required);
    }

    const project = await ProjectService.create({
      name: data.name,
      website: data.website,
      userId: user?.id!,
    });

    res.sendSuccess({ project });
  })
);

// delete project by id
projectRoute.delete(
  "/:projectId",
  authenticateUser,
  asyncHandler(async (req, res) => {
    const user = req?.user;
    const { projectId } = req.params;

    if (!projectId) {
      return res.sendError(error_messages.project.id_required);
    }

    const result = await ProjectService.delete({
      userId: user?.id!,
      projectId,
    });

    if (!result) {
      return res.sendError(error_messages.project.delete_failed);
    }

    res.sendSuccess({ message: "Project deleted successfully." });
  })
);

export default projectRoute;
