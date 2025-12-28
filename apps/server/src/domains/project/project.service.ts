import { Project } from "../../generated/prisma/client";
import CustomError from "../../lib/custom-error";
import prisma from "../../lib/db";
import error_messages from "../../lib/errors-messages";
import idCodecs from "../../lib/id-codec";

const ProjectService = {
  getByUserId: async ({
    userId,
    projectId,
  }: {
    userId: string;
    projectId: string;
  }): Promise<Project | null> => {
    const project = await prisma.project.findFirst({
      where: { userId, id: projectId },
    });

    return project;
  },

  getAllByUserId: async (userId: string): Promise<Project[]> => {
    const projects = await prisma.project.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    return projects;
  },

  create: async (data: {
    name: string;
    website: string;
    userId: string;
  }): Promise<Project> => {
    const project = await prisma.project.create({
      data: {
        id: idCodecs.projectId(),
        name: data.name,
        domain: data.website,
        userId: data.userId,
        appId: idCodecs.projectAppId(),
      },
    });

    return project;
  },

  updatePublicAccess: async ({
    userId,
    projectId,
    currentAccessStatus,
  }: {
    userId: string;
    projectId: string;
    currentAccessStatus: boolean;
  }) => {
    const project = await prisma.project.update({
      where: {
        userId,
        id: projectId,
      },
      data: {
        isPublic: !currentAccessStatus,
      },
    });

    return project;
  },

  delete: async ({
    userId,
    projectId,
  }: {
    userId: string;
    projectId: string;
  }) => {
    try {
      const result = await prisma.project.delete({
        where: {
          userId,
          id: projectId,
        },
      });

      return result;
    } catch {
      throw new CustomError(error_messages.project.delete_failed);
    }
  },

  getProjectByAppId: async (appId: string): Promise<Project | null> => {
    const project = await prisma.project.findUnique({
      where: {
        appId,
      },
    });

    return project;
  },
};

export default ProjectService;
