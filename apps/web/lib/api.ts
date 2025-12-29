import axios from "axios";
import { TimePeriod } from "@/components/dashboard/time-period-select";

type ApiVersion = "v1" | "v2";

const createInstance = (version: ApiVersion) => {
  const instance = axios.create({
    baseURL: `${process.env.NEXT_PUBLIC_API_BASE_URL}/${version}`,
  });

  instance.interceptors.response.use(
    (response) => response.data,
    (error) => Promise.reject(error)
  );

  return instance;
};

const apiV1 = createInstance("v1");

export const authAPI = {
  login: (email: string, password: string) =>
    apiV1.post("/auth/login", { email, password }),

  signup: (email: string, password: string) =>
    apiV1.post("/auth/signup", { email, password }),

  logout: () => apiV1.post("/auth/logout"),
};

export const projectAPI = {
  getAll: () => apiV1.get("/project"),

  getDashboard: (appId: string) => apiV1.get(`/project/dashboard/${appId}`),

  getStats: (appId: string, period: TimePeriod) =>
    apiV1.get(`/project/dashboard/${appId}/stats`, {
      params: { period },
    }),

  getBrowser: (appId: string, period: TimePeriod) =>
    apiV1.get(`/project/dashboard/${appId}/browser`, {
      params: { period },
    }),

  create: (name: string, website: string) =>
    apiV1.post("/project", { name, website }),

  updateAccess: (projectId: string) =>
    apiV1.patch(`/project/${projectId}/public-access`),

  delete: (projectId: string) => apiV1.delete(`/project/${projectId}`),
};

export const userAPI = {
  me: () => apiV1.get("/user/me"),

  deleteAccount: () => apiV1.delete("/user"),
};
