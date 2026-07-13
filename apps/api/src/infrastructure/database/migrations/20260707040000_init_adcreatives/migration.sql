-- Create Table: ad_creatives
CREATE TABLE "ad_creatives" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "campaign_id" UUID NOT NULL,
    "creative_type" VARCHAR NOT NULL,
    "name" VARCHAR NOT NULL,
    "primary_text" VARCHAR NOT NULL,
    "headline" VARCHAR NOT NULL,
    "description" VARCHAR,
    "call_to_action" VARCHAR NOT NULL,
    "destination_url" VARCHAR NOT NULL,
    "display_link" VARCHAR,
    "caption" VARCHAR,
    "link_description" VARCHAR,
    "facebook_page_id" UUID,
    "instagram_account_id" UUID,
    "media_type" VARCHAR,
    "media_asset_id" VARCHAR,
    "thumbnail_asset_id" VARCHAR,
    "pixel_id" UUID,
    "tracking_parameters" JSONB NOT NULL,
    "creative_spec" JSONB NOT NULL,
    "status" "campaign_status" NOT NULL DEFAULT 'DRAFT',
    "draft_version" INT NOT NULL DEFAULT 1,
    "external_creative_id" VARCHAR,
    "published_at" TIMESTAMPTZ,
    "published_by" UUID,
    "publish_response" JSONB,
    "created_by" UUID NOT NULL,
    "updated_by" UUID NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMPTZ,

    CONSTRAINT "pk_ad_creatives" PRIMARY KEY ("id"),
    CONSTRAINT "fk_ad_creatives_campaigns_campaign_id" FOREIGN KEY ("campaign_id") REFERENCES "campaigns"("id") ON DELETE CASCADE,
    CONSTRAINT "fk_ad_creatives_meta_pages_facebook_page_id" FOREIGN KEY ("facebook_page_id") REFERENCES "meta_pages"("id") ON DELETE SET NULL,
    CONSTRAINT "fk_ad_creatives_meta_instagram_accounts_instagram_account_id" FOREIGN KEY ("instagram_account_id") REFERENCES "meta_instagram_accounts"("id") ON DELETE SET NULL,
    CONSTRAINT "fk_ad_creatives_meta_pixels_pixel_id" FOREIGN KEY ("pixel_id") REFERENCES "meta_pixels"("id") ON DELETE SET NULL,
    CONSTRAINT "fk_ad_creatives_users_created_by" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE CASCADE,
    CONSTRAINT "fk_ad_creatives_users_updated_by" FOREIGN KEY ("updated_by") REFERENCES "users"("id") ON DELETE CASCADE,
    CONSTRAINT "fk_ad_creatives_users_published_by" FOREIGN KEY ("published_by") REFERENCES "users"("id") ON DELETE SET NULL
);

-- Create Table: ad_creative_labels
CREATE TABLE "ad_creative_labels" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "ad_creative_id" UUID NOT NULL,
    "name" VARCHAR NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "pk_ad_creative_labels" PRIMARY KEY ("id"),
    CONSTRAINT "fk_ad_creative_labels_ad_creatives_ad_creative_id" FOREIGN KEY ("ad_creative_id") REFERENCES "ad_creatives"("id") ON DELETE CASCADE
);

-- Create Table: ad_creative_tags
CREATE TABLE "ad_creative_tags" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "ad_creative_id" UUID NOT NULL,
    "name" VARCHAR NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "pk_ad_creative_tags" PRIMARY KEY ("id"),
    CONSTRAINT "fk_ad_creative_tags_ad_creatives_ad_creative_id" FOREIGN KEY ("ad_creative_id") REFERENCES "ad_creatives"("id") ON DELETE CASCADE
);

-- Create Table: ad_creative_histories
CREATE TABLE "ad_creative_histories" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "ad_creative_id" UUID NOT NULL,
    "version" INT NOT NULL,
    "snapshot" JSONB NOT NULL,
    "author_id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "pk_ad_creative_histories" PRIMARY KEY ("id"),
    CONSTRAINT "fk_ad_creative_histories_ad_creatives_ad_creative_id" FOREIGN KEY ("ad_creative_id") REFERENCES "ad_creatives"("id") ON DELETE CASCADE,
    CONSTRAINT "fk_ad_creative_histories_users_author_id" FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE CASCADE
);
