import { Project } from "../../generated/prisma/client";
import CustomError from "../../lib/custom-error";
import prisma from "../../lib/db";
import error_messages from "../../lib/errors-messages";
import idCodecs from "../../lib/id-codec";
import {
  getPreviousRange,
  getTimeRange,
  percentChange,
  Period,
} from "../../lib/utils";

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

  getProjectForDashboard: async ({
    appId,
    userId,
  }: {
    appId: string;
    userId?: string;
  }): Promise<Project> => {
    if (!appId) {
      throw new CustomError(error_messages.project.id_required);
    }

    const project = await ProjectService.getProjectByAppId(appId);

    if (!project) {
      throw new CustomError(error_messages.project.not_found);
    }

    // if project is not public, check userId
    if (!project.isPublic && userId !== project.userId) {
      throw new CustomError(error_messages.project.access_denied);
    }

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
      // sessions
      totalSessions,
      prevTotalSessions,

      // page views
      totalPageViews,
      prevTotalPageViews,

      // unique visitors (raw SQL)
      [{ count: uniqueVisitors }],
      [{ count: prevUniqueVisitors }],
    ] = await Promise.all([
      prisma.session.count({
        where: {
          projectId,
          startedAt: { gte: startDate, lt: endDate },
        },
      }),
      prisma.session.count({
        where: {
          projectId,
          startedAt: { gte: previous.start, lt: previous.end },
        },
      }),

      prisma.pageView.count({
        where: {
          projectId,
          createdAt: { gte: startDate, lt: endDate },
        },
      }),
      prisma.pageView.count({
        where: {
          projectId,
          createdAt: { gte: previous.start, lt: previous.end },
        },
      }),

      prisma.$queryRaw<{ count: bigint }[]>`
      SELECT COUNT(DISTINCT "visitor_id") AS count
      FROM "page_views"
      WHERE "project_id" = ${projectId}
        AND "created_at" >= ${startDate}
        AND "created_at" < ${endDate}
    `,
      prisma.$queryRaw<{ count: bigint }[]>`
      SELECT COUNT(DISTINCT "visitor_id") AS count
      FROM "page_views"
      WHERE "project_id" = ${projectId}
        AND "created_at" >= ${previous.start}
        AND "created_at" < ${previous.end}
    `,
    ]);

    const uniqueVisitorsCount = Number(uniqueVisitors);
    const prevUniqueVisitorsCount = Number(prevUniqueVisitors);

    return {
      total_visitor: {
        count: totalSessions,
        change: percentChange(totalSessions, prevTotalSessions) ?? 0,
      },
      unique_visitor: {
        count: uniqueVisitorsCount,
        change:
          percentChange(uniqueVisitorsCount, prevUniqueVisitorsCount) ?? 0,
      },
      page_views: {
        count: totalPageViews,
        change: percentChange(totalPageViews, prevTotalPageViews) ?? 0,
      },
    };
  },

  getGraph: async ({
    projectId,
    period,
  }: {
    projectId: string;
    period: Period;
  }) => {
    const { start, end } = getTimeRange(period);

    const [rawUniqueVisitors, rawTotalVisitors, rawPageViews] =
      await Promise.all([
        // raw unique visitors
        prisma.$queryRaw<{ date: Date; count: bigint }[]>`
          SELECT DATE("created_at") AS date,
                COUNT(DISTINCT "visitor_id") AS count
          FROM "page_views"
          WHERE "project_id" = ${projectId}
            AND "created_at" >= ${start}
            AND "created_at" < ${end}
          GROUP BY date
          ORDER BY date ASC
        `,
        // raw total visitors
        prisma.$queryRaw<{ date: Date; count: bigint }[]>`
          SELECT DATE("started_at") AS date,
                COUNT(*) AS count
          FROM "sessions"
          WHERE "project_id" = ${projectId}
            AND "started_at" >= ${start}
            AND "started_at" < ${end}
          GROUP BY date
          ORDER BY date ASC
        `,
        // raw page views
        prisma.$queryRaw<{ date: Date; count: bigint }[]>`
          SELECT DATE("created_at") AS date,
                COUNT(*) AS count
          FROM "page_views"
          WHERE "project_id" = ${projectId}
            AND "created_at" >= ${start}
            AND "created_at" < ${end}
          GROUP BY date
          ORDER BY date ASC
        `,
      ]);

    const uniqueVisitors = rawUniqueVisitors.map((row) => ({
      date: row.date,
      count: Number(row.count),
    }));

    const pageViews = rawPageViews.map((row) => ({
      date: row.date,
      count: Number(row.count),
    }));

    const totalVisits = rawTotalVisitors.map((row) => ({
      date: row.date,
      count: Number(row.count),
    }));

    return {
      uniqueVisitors,
      pageViews,
      totalVisits,
    };
  },
};

export default ProjectService;
