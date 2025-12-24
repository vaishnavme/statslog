import { Projects } from "../../generated/prisma/client";
import prisma from "../../lib/db";
import idCodecs from "../../lib/id-codec";

const ProjectService = {
  getByUserId: async ({
    userId,
    projectId,
  }: {
    userId: string;
    projectId: string;
  }): Promise<Projects | null> => {
    const project = await prisma.projects.findFirst({
      where: { userId, id: projectId },
    });

    return project;
  },

  getAllByUserId: async (userId: string): Promise<Projects[]> => {
    const projects = await prisma.projects.findMany({
      where: { userId },
    });

    return projects;
  },

  create: async (data: {
    name: string;
    website: string;
    userId: string;
  }): Promise<Projects> => {
    const project = await prisma.projects.create({
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

  delete: async ({
    userId,
    projectId,
  }: {
    userId: string;
    projectId: string;
  }) => {
    await prisma.projects.delete({
      where: {
        userId,
        id: projectId,
      },
    });
  },
};

export default ProjectService;
