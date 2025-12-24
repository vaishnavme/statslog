/*
  Warnings:

  - You are about to drop the column `sessionToken` on the `Sessions` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Sessions_sessionToken_key";

-- AlterTable
ALTER TABLE "Sessions" DROP COLUMN "sessionToken";
