/*
  Warnings:

  - A unique constraint covering the columns `[adid]` on the table `Job` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `adid` to the `Job` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Job" ADD COLUMN     "adid" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Job_adid_key" ON "Job"("adid");
