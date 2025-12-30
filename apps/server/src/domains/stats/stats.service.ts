import { PageView, Session, Visitor } from "@prisma/client";
import useragent, { AgentDetails } from "express-useragent";
import prisma from "../../lib/db";
import idCodecs from "../../lib/id-codec";

const device = {
  mobile: "Mobile",
  tablet: "Tablet",
  desktop: "Desktop",
  smartTV: "Smart TV",
  chromebook: "Chromebook",
  unknown: "Unknown",
} as const;

const StatsService = {
  getDeviceType: (ua: AgentDetails): (typeof device)[keyof typeof device] => {
    switch (true) {
      case ua.isMobile:
      case ua.isiPhone:
      case ua.isAndroid:
        return device.mobile;

      case ua.isTablet:
      case ua.isiPad:
        return device.tablet;

      case ua.isChromeOS:
        return device.chromebook;

      case ua.isDesktop:
        return device.desktop;

      case ua.isSmartTV:
        return device.smartTV;

      default:
        return device.unknown;
    }
  },

  getVistorDeviceInfo: (
    userAgent: string
  ): {
    os: string;
    isBot: boolean;
    browser: string;
    platform: string;
    device: (typeof device)[keyof typeof device];
  } => {
    const ua = useragent.parse(userAgent);

    return {
      os: ua.os || "Unknown",
      browser: ua.browser || "Unknown",
      platform: ua.platform || "Unknown",
      device: StatsService.getDeviceType(ua),
      isBot: Boolean(ua?.isBot) || false,
    };
  },

  createVisitor: async ({
    projectId,
    anonymousId,
  }: {
    projectId: string;
    anonymousId: string;
  }): Promise<Visitor> => {
    const existingVisitor = await prisma.visitor.findFirst({
      where: {
        projectId,
        anonymousId,
      },
    });

    if (existingVisitor) {
      return existingVisitor;
    }

    const visitor = await prisma.visitor.create({
      data: {
        id: idCodecs.visitorId(),
        projectId,
        anonymousId,
      },
    });

    return visitor;
  },

  createSession: async ({
    projectId,
    visitorId,
    sessionId,
    userAgent,
  }: {
    projectId: string;
    visitorId: string;
    sessionId: string;
    userAgent?: {
      os: string;
      isBot: boolean;
      browser: string;
      platform: string;
      device: (typeof device)[keyof typeof device];
    };
  }): Promise<Session> => {
    const existingSession = await prisma.session.findUnique({
      where: {
        id: sessionId,
        projectId,
        visitorId,
      },
    });

    if (existingSession) {
      return existingSession;
    }

    const session = await prisma.session.create({
      data: {
        id: sessionId,
        projectId,
        visitorId,
        ...(userAgent ? { ...userAgent } : {}),
      },
    });

    return session;
  },

  createPageView: async ({
    projectId,
    visitorId,
    sessionId,
    path,
    title,
  }: {
    projectId: string;
    visitorId: string;
    sessionId: string;
    path: string;
    title?: string;
  }): Promise<PageView> => {
    const pageView = await prisma.pageView.create({
      data: {
        id: idCodecs.pageViewId(),
        projectId,
        visitorId,
        sessionId,
        path,
        title,
      },
    });

    return pageView;
  },
};

export default StatsService;
