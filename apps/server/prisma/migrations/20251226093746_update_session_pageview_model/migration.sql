/*
  Warnings:

  - You are about to drop the column `city` on the `page_views` table. All the data in the column will be lost.
  - You are about to drop the column `country` on the `page_views` table. All the data in the column will be lost.
  - You are about to drop the column `url` on the `page_views` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "page_views" DROP COLUMN "city",
DROP COLUMN "country",
DROP COLUMN "url";
