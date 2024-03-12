/*
  Warnings:

  - The primary key for the `Job` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `adid` on the `Job` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[id]` on the table `Job` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Job_adid_key";

-- AlterTable
ALTER TABLE "Job" DROP CONSTRAINT "Job_pkey",
DROP COLUMN "adid",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Job_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Job_id_seq";

-- CreateIndex
CREATE UNIQUE INDEX "Job_id_key" ON "Job"("id");
