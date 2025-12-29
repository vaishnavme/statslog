import { Project } from "../../generated/prisma/client";
import CustomError from "../../lib/custom-error";
import prisma from "../../lib/db";
import error_messages from "../../lib/errors-messages";
import idCodecs from "../../lib/id-codec";
import { getPreviousRange, percentChange } from "../../lib/utils";

const ProjectService = {
  getByUserProjectId: async ({
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

  getProjectVisitorStats: async ({
    projectId,
    startDate,
    endDate,
  }: {
    projectId: string;
    startDate: Date;
    endDate: Date;
  }) => {
    const previous = getPreviousRange(startDate, endDate);

    const [
      uniqueVisitors,
      prevUniqueVisitors,

      totalVisitors,
      prevTotalVisitors,

      totalPageViews,
      prevTotalPageViews,
    ] = await Promise.all([
      prisma.visitor.count({
        where: { projectId, createdAt: { gte: startDate, lte: endDate } },
      }),
      prisma.visitor.count({
        where: {
          projectId,
          createdAt: { gte: previous.start, lte: previous.end },
        },
      }),
      prisma.session.count({
        where: { projectId, startedAt: { gte: startDate, lte: endDate } },
      }),
      prisma.session.count({
        where: {
          projectId,
          startedAt: { gte: previous.start, lte: previous.end },
        },
      }),

      prisma.pageView.count({
        where: { projectId, createdAt: { gte: startDate, lte: endDate } },
      }),
      prisma.pageView.count({
        where: {
          projectId,
          createdAt: { gte: previous.start, lte: previous.end },
        },
      }),
    ]);

    const rawVisitorGraph = await prisma.$queryRaw<
      { date: Date; count: bigint }[]
    >`
        SELECT DATE("created_at") AS date,
              COUNT(DISTINCT "visitor_id") AS count
        FROM "page_views"
        WHERE "project_id" = ${projectId}
          AND "created_at" BETWEEN ${startDate} AND ${endDate}
        GROUP BY date
        ORDER BY date ASC
    `;

    const visitorGraph = rawVisitorGraph.map((row) => ({
      date: row.date,
      count: Number(row.count),
    }));
    return {
      total_visitor: {
        current: totalVisitors,
        change: percentChange(totalVisitors, prevTotalVisitors),
      },
      unique_visitor: {
        current: uniqueVisitors,
        change: percentChange(uniqueVisitors, prevUniqueVisitors),
      },
      total_pages: {
        current: totalPageViews,
        change: percentChange(totalPageViews, prevTotalPageViews),
      },
      visitor_graph: visitorGraph,
    };
  },
};

export default ProjectService;
