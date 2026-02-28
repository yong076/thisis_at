-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "BlockType" ADD VALUE 'FAQ';
ALTER TYPE "BlockType" ADD VALUE 'BUSINESS_HOURS';
ALTER TYPE "BlockType" ADD VALUE 'RICH_TEXT';
ALTER TYPE "BlockType" ADD VALUE 'TEAM_MEMBERS';

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "ProfileType" ADD VALUE 'BUSINESS';
ALTER TYPE "ProfileType" ADD VALUE 'INFLUENCER';
ALTER TYPE "ProfileType" ADD VALUE 'PERSONAL';
ALTER TYPE "ProfileType" ADD VALUE 'RESTAURANT';
ALTER TYPE "ProfileType" ADD VALUE 'ORGANIZATION';

-- AlterTable
ALTER TABLE "profiles" ADD COLUMN     "category_id" TEXT;

-- CreateTable
CREATE TABLE "categories" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name_ko" TEXT NOT NULL,
    "icon" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "categories_slug_key" ON "categories"("slug");

-- CreateIndex
CREATE INDEX "profiles_category_id_idx" ON "profiles"("category_id");

-- CreateIndex
CREATE INDEX "profiles_is_published_idx" ON "profiles"("is_published");

-- AddForeignKey
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;
