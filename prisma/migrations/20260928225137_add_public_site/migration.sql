-- CreateEnum
CREATE TYPE "SiteCardSection" AS ENUM ('MAIN_FEATURE', 'TIMER_FEATURE');

-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "coverPublicId" TEXT;

-- AlterTable
ALTER TABLE "Highlight" ADD COLUMN     "photoPublicId" TEXT;

-- CreateTable
CREATE TABLE "SiteCard" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "section" "SiteCardSection" NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "bullets" JSONB,
    "linkLabel" TEXT,
    "linkHref" TEXT,
    "imageUrl" TEXT,
    "imagePublicId" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SiteCard_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SiteCard_slug_key" ON "SiteCard"("slug");
