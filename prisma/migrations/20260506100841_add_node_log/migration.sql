-- CreateTable
CREATE TABLE "NodeState" (
    "id" TEXT NOT NULL,
    "goal" TEXT NOT NULL,
    "blocker" TEXT,
    "childNodeIds" TEXT[],

    CONSTRAINT "NodeState_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NodeContextState" (
    "id" TEXT NOT NULL,
    "rootNodeId" TEXT NOT NULL,
    "pathFromRoot" TEXT[],
    "intentSummary" TEXT NOT NULL,
    "constraints" TEXT[],
    "successSignals" TEXT[],
    "nodeStateId" TEXT NOT NULL,

    CONSTRAINT "NodeContextState_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NodeTransition" (
    "id" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "triggeredBy" TEXT NOT NULL,
    "nodeId" TEXT NOT NULL,
    "nodeTransitionHistoryId" TEXT NOT NULL,
    "fromStateId" TEXT,
    "toStateId" TEXT,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "NodeTransition_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NodeTransitionHistory" (
    "id" TEXT NOT NULL,
    "nodeId" TEXT NOT NULL,

    CONSTRAINT "NodeTransitionHistory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "NodeContextState_nodeStateId_key" ON "NodeContextState"("nodeStateId");

-- CreateIndex
CREATE UNIQUE INDEX "NodeTransitionHistory_nodeId_key" ON "NodeTransitionHistory"("nodeId");

-- AddForeignKey
ALTER TABLE "NodeContextState" ADD CONSTRAINT "NodeContextState_nodeStateId_fkey" FOREIGN KEY ("nodeStateId") REFERENCES "NodeState"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NodeTransition" ADD CONSTRAINT "NodeTransition_nodeTransitionHistoryId_fkey" FOREIGN KEY ("nodeTransitionHistoryId") REFERENCES "NodeTransitionHistory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NodeTransition" ADD CONSTRAINT "NodeTransition_fromStateId_fkey" FOREIGN KEY ("fromStateId") REFERENCES "NodeState"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NodeTransition" ADD CONSTRAINT "NodeTransition_toStateId_fkey" FOREIGN KEY ("toStateId") REFERENCES "NodeState"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NodeTransitionHistory" ADD CONSTRAINT "NodeTransitionHistory_nodeId_fkey" FOREIGN KEY ("nodeId") REFERENCES "Node"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
