/*
  Warnings:

  - You are about to drop the column `rootNodeId` on the `Tree` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[treeId]` on the table `Node` will be added. If there are existing duplicate values, this will fail.
  - Made the column `projectId` on table `Tree` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Tree" DROP CONSTRAINT "Tree_rootNodeId_fkey";

-- DropIndex
DROP INDEX "Tree_rootNodeId_key";

-- AlterTable
ALTER TABLE "Node" ADD COLUMN     "treeId" TEXT;

-- AlterTable
ALTER TABLE "Tree" DROP COLUMN "rootNodeId",
ALTER COLUMN "projectId" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Node_treeId_key" ON "Node"("treeId");

-- AddForeignKey
ALTER TABLE "Node" ADD CONSTRAINT "Node_treeId_fkey" FOREIGN KEY ("treeId") REFERENCES "Tree"("id") ON DELETE CASCADE ON UPDATE CASCADE;
