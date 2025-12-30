export const EMAIL_REGEX =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export const isValidEmail = (email: string) => {
  return String(email).toLowerCase().match(EMAIL_REGEX);
};

export type Period = "today" | "24h" | "3d" | "7d" | "1m" | "3m" | "all";

export const getTimeRange = (period: Period) => {
  const now = new Date();
  const start = new Date(now);

  switch (period) {
    case "today":
      start.setHours(0, 0, 0, 0);
      return { start, end: now };

    case "24h":
      start.setHours(now.getHours() - 24);
      return { start, end: now };

    case "3d":
      start.setDate(now.getDate() - 3);
      return { start, end: now };

    case "7d":
      start.setDate(now.getDate() - 7);
      return { start, end: now };

    case "1m":
      start.setMonth(now.getMonth() - 1);
      return { start, end: now };

    case "3m":
      start.setMonth(now.getMonth() - 3);
      return { start, end: now };

    case "all":
      return { start: new Date(0), end: now };
  }
};

export const getPreviousRange = (start: Date, end: Date) => {
  const diff = end.getTime() - start.getTime();
  return {
    start: new Date(start.getTime() - diff),
    end: start,
  };
};

export function percentChange(
  current: number,
  previous: number
): number | null {
  if (previous === 0 && current === 0) return 0;
  if (previous === 0) return null;

  return Number((((current - previous) / previous) * 100).toFixed(2));
}
