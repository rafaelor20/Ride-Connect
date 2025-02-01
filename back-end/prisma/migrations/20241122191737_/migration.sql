/*
  Warnings:

  - You are about to drop the column `latitude` on the `Destination` table. All the data in the column will be lost.
  - You are about to drop the column `longitude` on the `Destination` table. All the data in the column will be lost.
  - You are about to drop the column `latitude` on the `Origin` table. All the data in the column will be lost.
  - You are about to drop the column `longitude` on the `Origin` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Destination" DROP COLUMN "latitude",
DROP COLUMN "longitude";

-- AlterTable
ALTER TABLE "Origin" DROP COLUMN "latitude",
DROP COLUMN "longitude";
