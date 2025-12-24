import "dotenv/config";

export const config = {
  env: process.env.ENV,
  port: process.env.PORT,
  database_url: process.env.DATABASE_URL,
  jwt_secret: process.env.JWT_SECRET,
} as const;

export const isProd = () => config.env === "prod";
export const isDev = () => config.env === "dev";
export const isStaging = () => config.env === "staging";
