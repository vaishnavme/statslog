import { Router } from "express";
import asyncHandler from "../../lib/async-handler";
import error_messages from "../../lib/errors-messages";
import ProjectService from "./project.service";

const projectRoute = Router();

// get all projects for user
projectRoute.get(
  "/",
  asyncHandler(async (req, res) => {
    const user = req?.user;

    const projects = await ProjectService.getAllByUserId(user?.id!);

    res.sendSuccess({ projects });
  })
);

// get project by id
projectRoute.get(
  "/:projectId",
  asyncHandler(async (req, res) => {
    const user = req?.user;
    const { projectId } = req.params;

    if (!projectId) {
      return res.sendError(error_messages.project.id_required);
    }

    const project = await ProjectService.getByUserId({
      userId: user?.id!,
      projectId,
    });

    if (!project) {
      return res.sendError(error_messages.project.not_found);
    }

    res.sendSuccess({ project });
  })
);

// create project
projectRoute.post(
  "/",
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
