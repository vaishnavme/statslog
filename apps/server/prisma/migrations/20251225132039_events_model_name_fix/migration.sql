/*
  Warnings:

  - You are about to drop the `events` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "events" DROP CONSTRAINT "events_project_id_fkey";

-- DropForeignKey
ALTER TABLE "events" DROP CONSTRAINT "events_session_id_fkey";

-- DropForeignKey
ALTER TABLE "events" DROP CONSTRAINT "events_visitor_id_fkey";

-- DropTable
DROP TABLE "events";

-- CreateTable
CREATE TABLE "events_data" (
    "id" TEXT NOT NULL,
    "project_id" TEXT NOT NULL,
    "visitor_id" TEXT NOT NULL,
    "session_id" TEXT NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "category" VARCHAR(100),
    "path" VARCHAR(255) NOT NULL,
    "data" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "events_data_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "projects_app_id_idx" ON "projects"("app_id");

-- CreateIndex
CREATE INDEX "visitors_anonymous_id_idx" ON "visitors"("anonymous_id");

-- AddForeignKey
ALTER TABLE "events_data" ADD CONSTRAINT "events_data_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "events_data" ADD CONSTRAINT "events_data_visitor_id_fkey" FOREIGN KEY ("visitor_id") REFERENCES "visitors"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "events_data" ADD CONSTRAINT "events_data_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
