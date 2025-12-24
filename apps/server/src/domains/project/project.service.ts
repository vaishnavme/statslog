import prisma from "../../lib/db";
import idCodecs from "../../lib/id-codec";

const ProjectService = {
  create: async (data: { name: string; website: string; userId: string }) => {
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
};

export default ProjectService;
