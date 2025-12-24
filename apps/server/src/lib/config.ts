import "dotenv/config";

type Config = {
  env: string | undefined;
  port: string | undefined;
  database_url: string | undefined;
  jwt_secret: string | undefined;
};

export const config: Config = {
  env: process.env.ENV,
  port: process.env.PORT,
  database_url: process.env.DATABASE_URL,
  jwt_secret: process.env.JWT_SECRET,
};

export const isProd = () => config.env === "prod";
export const isDev = () => config.env === "dev";
export const isStaging = () => config.env === "staging";
