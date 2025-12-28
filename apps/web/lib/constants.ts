export const app_paths = {
  fe_url: process.env.NEXT_PUBLIC_FE_URL,
  home: "/",
  login: "/login",
  signup: "/signup",
  dashboard: "/dashboard",
  settings: "/settings",
  projectDashboard: (domain: string) => `/dashboard/${domain}`,
};
