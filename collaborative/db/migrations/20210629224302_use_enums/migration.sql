/*
  Warnings:

  - A unique constraint covering the columns `[providerId,providerAccountId]` on the table `Account` will be added. If there are existing duplicate values, this will fail.
  - Changed the type of `providerType` on the `Account` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `providerId` on the `Account` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "AccountProviderType" AS ENUM ('oauth');

-- CreateEnum
CREATE TYPE "AccountProvider" AS ENUM ('discord', 'google');

-- AlterTable
ALTER TABLE "Account" DROP COLUMN "providerType",
ADD COLUMN     "providerType" "AccountProviderType" NOT NULL,
DROP COLUMN "providerId",
ADD COLUMN     "providerId" "AccountProvider" NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Account.providerId_providerAccountId_unique" ON "Account"("providerId", "providerAccountId");
