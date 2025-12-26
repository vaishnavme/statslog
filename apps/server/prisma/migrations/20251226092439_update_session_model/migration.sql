-- AlterTable
ALTER TABLE "sessions" ADD COLUMN     "is_bot" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "platform" VARCHAR(50);
