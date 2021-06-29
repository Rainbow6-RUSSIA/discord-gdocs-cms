-- AlterTable
ALTER TABLE "Account" ADD COLUMN     "cachedAt" TIMESTAMP(3),
ALTER COLUMN "cachedProfile" DROP NOT NULL,
ALTER COLUMN "cachedProfile" DROP DEFAULT;
