/*
  Warnings:

  - A unique constraint covering the columns `[appId]` on the table `Projects` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `appId` to the `Projects` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Projects" ADD COLUMN     "appId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Projects_appId_key" ON "Projects"("appId");
