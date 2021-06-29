-- AlterTable
ALTER TABLE "Account" ADD COLUMN     "cachedProfile" JSONB NOT NULL DEFAULT E'{}';
