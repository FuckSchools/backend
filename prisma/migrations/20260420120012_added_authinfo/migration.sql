-- AlterEnum
ALTER TYPE "MessageRole" ADD VALUE 'AI';

-- CreateTable
CREATE TABLE "AuthInfo" (
    "userId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,

    CONSTRAINT "AuthInfo_pkey" PRIMARY KEY ("userId")
);

-- CreateIndex
CREATE UNIQUE INDEX "AuthInfo_email_key" ON "AuthInfo"("email");

-- AddForeignKey
ALTER TABLE "AuthInfo" ADD CONSTRAINT "AuthInfo_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
