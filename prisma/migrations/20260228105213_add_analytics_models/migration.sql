-- CreateTable
CREATE TABLE "page_views" (
    "id" TEXT NOT NULL,
    "profile_id" TEXT NOT NULL,
    "visitor_hash" TEXT NOT NULL,
    "session_id" TEXT,
    "referrer" TEXT,
    "user_agent" TEXT,
    "device_type" TEXT,
    "browser_name" TEXT,
    "os_name" TEXT,
    "country" TEXT,
    "region" TEXT,
    "city" TEXT,
    "utm_source" TEXT,
    "utm_medium" TEXT,
    "utm_campaign" TEXT,
    "utm_content" TEXT,
    "utm_term" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "page_views_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "link_clicks" (
    "id" TEXT NOT NULL,
    "profile_id" TEXT NOT NULL,
    "block_id" TEXT NOT NULL,
    "visitor_hash" TEXT NOT NULL,
    "block_type" TEXT NOT NULL,
    "target_url" TEXT,
    "label" TEXT,
    "device_type" TEXT,
    "country" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "link_clicks_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "page_views_profile_id_created_at_idx" ON "page_views"("profile_id", "created_at");

-- CreateIndex
CREATE INDEX "page_views_profile_id_visitor_hash_created_at_idx" ON "page_views"("profile_id", "visitor_hash", "created_at");

-- CreateIndex
CREATE INDEX "page_views_created_at_idx" ON "page_views"("created_at");

-- CreateIndex
CREATE INDEX "link_clicks_profile_id_created_at_idx" ON "link_clicks"("profile_id", "created_at");

-- CreateIndex
CREATE INDEX "link_clicks_block_id_created_at_idx" ON "link_clicks"("block_id", "created_at");

-- AddForeignKey
ALTER TABLE "page_views" ADD CONSTRAINT "page_views_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "link_clicks" ADD CONSTRAINT "link_clicks_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
