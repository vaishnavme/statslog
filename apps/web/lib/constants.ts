export const app_name: string = "StatsLog";

export const app_paths = {
  fe_url: process.env.NEXT_PUBLIC_FE_URL,
  home: "/",
  login: "/login",
  signup: "/signup",
  dashboard: "/dashboard",
  settings: "/settings",
  projectDashboard: (domain: string) => `/dashboard/${domain}`,
};

export const github_repo: string = "https://github.com/vaishnavme/statslog";
