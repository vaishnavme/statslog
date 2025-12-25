/*
  Warnings:

  - You are about to alter the column `name` on the `projects` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(25)`.

*/
-- AlterTable
ALTER TABLE "projects" ALTER COLUMN "name" SET DATA TYPE VARCHAR(25);

-- CreateTable
CREATE TABLE "visitors" (
    "id" TEXT NOT NULL,
    "project_id" TEXT NOT NULL,
    "anonymous_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "visitors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sessions" (
    "id" TEXT NOT NULL,
    "project_id" TEXT NOT NULL,
    "visitor_id" TEXT NOT NULL,
    "started_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ended_at" TIMESTAMP(3),
    "referrer" VARCHAR(255),
    "utm_source" TEXT,
    "utm_medium" TEXT,
    "utm_campaign" TEXT,
    "utm_term" TEXT,
    "utm_content" TEXT,
    "os" VARCHAR(50),
    "browser" VARCHAR(50),
    "device" VARCHAR(50),
    "city" VARCHAR(100),
    "country" VARCHAR(100),

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "page_views" (
    "id" TEXT NOT NULL,
    "project_id" TEXT NOT NULL,
    "visitor_id" TEXT NOT NULL,
    "session_id" TEXT NOT NULL,
    "path" VARCHAR(255) NOT NULL,
    "url" VARCHAR(500) NOT NULL,
    "title" TEXT,
    "city" VARCHAR(100),
    "country" VARCHAR(100),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "page_views_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "visitors_project_id_idx" ON "visitors"("project_id");

-- CreateIndex
CREATE UNIQUE INDEX "visitors_project_id_anonymous_id_key" ON "visitors"("project_id", "anonymous_id");

-- CreateIndex
CREATE INDEX "sessions_project_id_started_at_idx" ON "sessions"("project_id", "started_at");

-- CreateIndex
CREATE INDEX "sessions_project_id_visitor_id_idx" ON "sessions"("project_id", "visitor_id");

-- CreateIndex
CREATE INDEX "page_views_project_id_created_at_idx" ON "page_views"("project_id", "created_at");

-- CreateIndex
CREATE INDEX "page_views_project_id_path_idx" ON "page_views"("project_id", "path");

-- CreateIndex
CREATE INDEX "page_views_project_id_visitor_id_idx" ON "page_views"("project_id", "visitor_id");

-- AddForeignKey
ALTER TABLE "visitors" ADD CONSTRAINT "visitors_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_visitor_id_fkey" FOREIGN KEY ("visitor_id") REFERENCES "visitors"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "page_views" ADD CONSTRAINT "page_views_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "page_views" ADD CONSTRAINT "page_views_visitor_id_fkey" FOREIGN KEY ("visitor_id") REFERENCES "visitors"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "page_views" ADD CONSTRAINT "page_views_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
