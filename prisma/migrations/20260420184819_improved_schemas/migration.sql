/*
  Warnings:

  - The values [USER] on the enum `MessageRole` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `stateOfCompletion` on the `Node` table. All the data in the column will be lost.
  - The `prerequisites` column on the `Node` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `name` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `treeId` on the `Project` table. All the data in the column will be lost.
  - Added the required column `title` to the `Project` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Status" AS ENUM ('NOT_STARTED', 'IN_PROGRESS', 'COMPLETED');

-- AlterEnum
BEGIN;
CREATE TYPE "MessageRole_new" AS ENUM ('SYSTEM', 'HUMAN', 'TOOL', 'AI');
ALTER TABLE "Message" ALTER COLUMN "role" TYPE "MessageRole_new" USING ("role"::text::"MessageRole_new");
ALTER TYPE "MessageRole" RENAME TO "MessageRole_old";
ALTER TYPE "MessageRole_new" RENAME TO "MessageRole";
DROP TYPE "public"."MessageRole_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_threadId_fkey";

-- DropForeignKey
ALTER TABLE "Node" DROP CONSTRAINT "Node_parentNodeId_fkey";

-- DropForeignKey
ALTER TABLE "Session" DROP CONSTRAINT "Session_projectId_fkey";

-- DropForeignKey
ALTER TABLE "Thread" DROP CONSTRAINT "Thread_sessionId_fkey";

-- DropForeignKey
ALTER TABLE "Tree" DROP CONSTRAINT "Tree_projectId_fkey";

-- DropIndex
DROP INDEX "Project_treeId_key";

-- AlterTable
ALTER TABLE "Node" DROP COLUMN "stateOfCompletion",
DROP COLUMN "prerequisites",
ADD COLUMN     "prerequisites" TEXT[];

-- AlterTable
ALTER TABLE "Project" DROP COLUMN "name",
DROP COLUMN "treeId",
ADD COLUMN     "title" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "StateOfCompletion" (
    "id" TEXT NOT NULL,
    "nodeId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'NOT_STARTED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StateOfCompletion_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Node" ADD CONSTRAINT "Node_parentNodeId_fkey" FOREIGN KEY ("parentNodeId") REFERENCES "Node"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StateOfCompletion" ADD CONSTRAINT "StateOfCompletion_nodeId_fkey" FOREIGN KEY ("nodeId") REFERENCES "Node"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Thread" ADD CONSTRAINT "Thread_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "Session"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_threadId_fkey" FOREIGN KEY ("threadId") REFERENCES "Thread"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tree" ADD CONSTRAINT "Tree_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;
