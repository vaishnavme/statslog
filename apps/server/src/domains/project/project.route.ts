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

    const user = await AuthService.getUserSessionFromToken(req);
    const project = await ProjectService.getProjectForDashboard({
      appId,
      userId: user?.id,
    });

    res.sendSuccess({ project });
  })
);

projectRoute.get(
  "/dashboard/:appId/stats",
  asyncHandler(async (req, res) => {
    const { appId } = req.params;
    const period = (req.query.period as Period) ?? "7d";

    const user = await AuthService.getUserSessionFromToken(req);
    const project = await ProjectService.getProjectForDashboard({
      appId,
      userId: user?.id,
    });

    const { start, end } = getTimeRange(period);

    const stats = await ProjectService.getProjectVisitorStats({
      projectId: project.id,
      startDate: start,
      endDate: end,
    });

    const graph = await ProjectService.getGraph({
      projectId: project.id,
      period,
    });

    res.sendSuccess({ stats, graph });
  })
);

projectRoute.get(
  "/dashboard/:appId/browser",
  asyncHandler(async (req, res) => {
    const { appId } = req.params;
    const period = (req.query.period as Period) ?? "7d";

    const user = await AuthService.getUserSessionFromToken(req);
    const project = await ProjectService.getProjectForDashboard({
      appId,
      userId: user?.id,
    });

    const browsers = await ProjectService.getBrowser({
      projectId: project.id,
      period,
    });

    res.sendSuccess({ browsers });
  })
);

projectRoute.get(
  "/dashboard/:appId/path",
  asyncHandler(async (req, res) => {
    const { appId } = req.params;
    const period = (req.query.period as Period) ?? "7d";

    const user = await AuthService.getUserSessionFromToken(req);
    const project = await ProjectService.getProjectForDashboard({
      appId,
      userId: user?.id,
    });

    const paths = await ProjectService.getPaths({
      projectId: project.id,
      period,
    });

    res.sendSuccess({ paths });
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

projectRoute.patch(
  "/:projectId",
  authenticateUser,
  asyncHandler(async (req, res) => {
    const user = req?.user;
    const { projectId } = req.params;
    const data = req.body;

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

    if (data?.name && !data?.name?.trim()) {
      return res.sendError(error_messages.project.name_required);
    }

    if (data?.website && !data?.website?.trim()) {
      return res.sendError(error_messages.project.website_required);
    }

    const updatedProject = await ProjectService.update({
      projectId,
      userId: user?.id!,
      data,
    });

    res.sendSuccess({ project: updatedProject });
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
