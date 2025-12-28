import axios from "axios";

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
};

export const projectAPI = {
  create: (name: string, website: string) =>
    apiV1.post("/project", { name, website }),
};

export const userAPI = {
  me: () => apiV1.get("/user/me"),
};
