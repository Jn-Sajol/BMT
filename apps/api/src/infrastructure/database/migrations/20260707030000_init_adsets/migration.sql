-- Create Table: adsets
CREATE TABLE "adsets" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "campaign_id" UUID NOT NULL,
    "name" VARCHAR NOT NULL,
    "status" "campaign_status" NOT NULL DEFAULT 'DRAFT',
    "optimization_goal" VARCHAR NOT NULL,
    "billing_event" VARCHAR NOT NULL,
    "bid_strategy" VARCHAR,
    "daily_budget" INT,
    "lifetime_budget" INT,
    "start_time" TIMESTAMPTZ NOT NULL,
    "end_time" TIMESTAMPTZ,
    "attribution_setting" VARCHAR,
    "targeting" JSONB NOT NULL,
    "promoted_object" JSONB,
    "meta_pixel_id" UUID,
    "instagram_account_id" UUID,
    "facebook_page_id" UUID,
    "draft_version" INT NOT NULL DEFAULT 1,
    "created_by" UUID NOT NULL,
    "updated_by" UUID NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMPTZ,
    "published_at" TIMESTAMPTZ,
    "published_by" UUID,
    "external_ad_set_id" VARCHAR,
    "publish_response" JSONB,

    CONSTRAINT "pk_adsets" PRIMARY KEY ("id"),
    CONSTRAINT "fk_adsets_campaigns_campaign_id" FOREIGN KEY ("campaign_id") REFERENCES "campaigns"("id") ON DELETE CASCADE,
    CONSTRAINT "fk_adsets_meta_pixels_meta_pixel_id" FOREIGN KEY ("meta_pixel_id") REFERENCES "meta_pixels"("id") ON DELETE SET NULL,
    CONSTRAINT "fk_adsets_meta_instagram_accounts_instagram_account_id" FOREIGN KEY ("instagram_account_id") REFERENCES "meta_instagram_accounts"("id") ON DELETE SET NULL,
    CONSTRAINT "fk_adsets_meta_pages_facebook_page_id" FOREIGN KEY ("facebook_page_id") REFERENCES "meta_pages"("id") ON DELETE SET NULL,
    CONSTRAINT "fk_adsets_users_created_by" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE CASCADE,
    CONSTRAINT "fk_adsets_users_updated_by" FOREIGN KEY ("updated_by") REFERENCES "users"("id") ON DELETE CASCADE,
    CONSTRAINT "fk_adsets_users_published_by" FOREIGN KEY ("published_by") REFERENCES "users"("id") ON DELETE SET NULL
);

-- Create Table: adset_labels
CREATE TABLE "adset_labels" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "adset_id" UUID NOT NULL,
    "name" VARCHAR NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "pk_adset_labels" PRIMARY KEY ("id"),
    CONSTRAINT "fk_adset_labels_adsets_adset_id" FOREIGN KEY ("adset_id") REFERENCES "adsets"("id") ON DELETE CASCADE
);

-- Create Table: adset_tags
CREATE TABLE "adset_tags" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "adset_id" UUID NOT NULL,
    "name" VARCHAR NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "pk_adset_tags" PRIMARY KEY ("id"),
    CONSTRAINT "fk_adset_tags_adsets_adset_id" FOREIGN KEY ("adset_id") REFERENCES "adsets"("id") ON DELETE CASCADE
);

-- Create Table: adset_histories
CREATE TABLE "adset_histories" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "adset_id" UUID NOT NULL,
    "version" INT NOT NULL,
    "snapshot" JSONB NOT NULL,
    "author_id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "pk_adset_histories" PRIMARY KEY ("id"),
    CONSTRAINT "fk_adset_histories_adsets_adset_id" FOREIGN KEY ("adset_id") REFERENCES "adsets"("id") ON DELETE CASCADE,
    CONSTRAINT "fk_adset_histories_users_author_id" FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE CASCADE
);
