/*
  Warnings:

  - You are about to drop the `AuthInfo` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "AuthInfo" DROP CONSTRAINT "AuthInfo_userId_fkey";

-- DropTable
DROP TABLE "AuthInfo";
