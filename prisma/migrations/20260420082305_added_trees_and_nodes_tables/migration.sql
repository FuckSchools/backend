/*
  Warnings:

  - A unique constraint covering the columns `[treeId]` on the table `Project` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Node" ADD COLUMN     "parentNodeId" TEXT;

-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "treeId" TEXT;

-- CreateTable
CREATE TABLE "Tree" (
    "id" TEXT NOT NULL,
    "projectId" TEXT,
    "rootNodeId" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Tree_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Tree_projectId_key" ON "Tree"("projectId");

-- CreateIndex
CREATE UNIQUE INDEX "Tree_rootNodeId_key" ON "Tree"("rootNodeId");

-- CreateIndex
CREATE UNIQUE INDEX "Project_treeId_key" ON "Project"("treeId");

-- AddForeignKey
ALTER TABLE "Node" ADD CONSTRAINT "Node_parentNodeId_fkey" FOREIGN KEY ("parentNodeId") REFERENCES "Node"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tree" ADD CONSTRAINT "Tree_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tree" ADD CONSTRAINT "Tree_rootNodeId_fkey" FOREIGN KEY ("rootNodeId") REFERENCES "Node"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
