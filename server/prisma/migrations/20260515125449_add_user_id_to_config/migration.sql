/*
  Warnings:

  - Added the required column `userId` to the `Config` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Config" ADD COLUMN     "userId" TEXT NOT NULL;
