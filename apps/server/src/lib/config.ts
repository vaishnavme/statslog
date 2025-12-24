export const env = {
  port: process.env.PORT || 3000,
  database_url: process.env.DATABASE_URL,
} as const;
