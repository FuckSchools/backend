/*
  Warnings:

  - You are about to drop the column `content` on the `Node` table. All the data in the column will be lost.
  - You are about to drop the column `parentNodeId` on the `Node` table. All the data in the column will be lost.
  - You are about to drop the column `treeId` on the `Node` table. All the data in the column will be lost.
  - You are about to drop the column `sandboxExId` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the `Prerequisite` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `StateOfCompletion` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Tree` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[projectId]` on the table `Node` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `blocker` to the `Node` table without a default value. This is not possible if the table is not empty.
  - Added the required column `depth` to the `Node` table without a default value. This is not possible if the table is not empty.
  - Added the required column `goal` to the `Node` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "NodeType" AS ENUM ('BUILDING', 'CONCEPT');

-- DropForeignKey
ALTER TABLE "Node" DROP CONSTRAINT "Node_parentNodeId_fkey";

-- DropForeignKey
ALTER TABLE "Node" DROP CONSTRAINT "Node_treeId_fkey";

-- DropForeignKey
ALTER TABLE "Prerequisite" DROP CONSTRAINT "Prerequisite_nodeId_fkey";

-- DropForeignKey
ALTER TABLE "StateOfCompletion" DROP CONSTRAINT "StateOfCompletion_nodeId_fkey";

-- DropForeignKey
ALTER TABLE "Tree" DROP CONSTRAINT "Tree_projectId_fkey";

-- DropIndex
DROP INDEX "Node_parentNodeId_idx";

-- DropIndex
DROP INDEX "Node_treeId_key";

-- DropIndex
DROP INDEX "Project_sandboxExId_key";

-- AlterTable
ALTER TABLE "Node" DROP COLUMN "content",
DROP COLUMN "parentNodeId",
DROP COLUMN "treeId",
ADD COLUMN     "blocker" TEXT NOT NULL,
ADD COLUMN     "depth" INTEGER NOT NULL,
ADD COLUMN     "goal" TEXT NOT NULL,
ADD COLUMN     "parentId" TEXT,
ADD COLUMN     "projectId" TEXT,
ADD COLUMN     "status" "Status" NOT NULL DEFAULT 'NOT_STARTED',
ADD COLUMN     "type" "NodeType" NOT NULL DEFAULT 'BUILDING';

-- AlterTable
ALTER TABLE "Project" DROP COLUMN "sandboxExId";

-- DropTable
DROP TABLE "Prerequisite";

-- DropTable
DROP TABLE "StateOfCompletion";

-- DropTable
DROP TABLE "Tree";

-- CreateTable
CREATE TABLE "NodeContext" (
    "id" TEXT NOT NULL,
    "nodeId" TEXT NOT NULL,
    "rootNodeId" TEXT NOT NULL,
    "pathFromRoot" TEXT[],
    "intentSummary" TEXT NOT NULL,
    "constraints" TEXT[],
    "successSignals" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "NodeContext_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "NodeContext_nodeId_key" ON "NodeContext"("nodeId");

-- CreateIndex
CREATE UNIQUE INDEX "Node_projectId_key" ON "Node"("projectId");

-- AddForeignKey
ALTER TABLE "Node" ADD CONSTRAINT "Node_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Node"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Node" ADD CONSTRAINT "Node_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NodeContext" ADD CONSTRAINT "NodeContext_nodeId_fkey" FOREIGN KEY ("nodeId") REFERENCES "Node"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
