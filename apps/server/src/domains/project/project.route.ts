import { Router } from "express";
import asyncHandler from "../../lib/async-handler";
import error_messages from "../../lib/errors-messages";
import ProjectService from "./project.service";

const projectRoute = Router();

projectRoute.post(
  "/create",
  asyncHandler(async (req, res) => {
    const user = req?.user;
    const data = req.body;

    if (!data?.name?.trim().length) {
      return res.sendError(error_messages.project.name_required);
    }

    if (!data?.website?.trim().length) {
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

export default projectRoute;
