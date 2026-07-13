-- Create Table: ads
CREATE TABLE "ads" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "workspace_id" UUID NOT NULL,
    "campaign_id" UUID NOT NULL,
    "ad_set_id" UUID NOT NULL,
    "creative_id" UUID NOT NULL,
    "name" VARCHAR NOT NULL,
    "status" "campaign_status" NOT NULL DEFAULT 'DRAFT',
    "draft_version" INT NOT NULL DEFAULT 1,
    "external_ad_id" VARCHAR,
    "published_at" TIMESTAMPTZ,
    "published_by" UUID,
    "publish_response" JSONB,
    "tracking_specs" JSONB NOT NULL,
    "display_status" VARCHAR,
    "review_status" VARCHAR,
    "created_by" UUID NOT NULL,
    "updated_by" UUID NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMPTZ,

    CONSTRAINT "pk_ads" PRIMARY KEY ("id"),
    CONSTRAINT "fk_ads_workspaces_workspace_id" FOREIGN KEY ("workspace_id") REFERENCES "workspaces"("id") ON DELETE CASCADE,
    CONSTRAINT "fk_ads_campaigns_campaign_id" FOREIGN KEY ("campaign_id") REFERENCES "campaigns"("id") ON DELETE CASCADE,
    CONSTRAINT "fk_ads_adsets_ad_set_id" FOREIGN KEY ("ad_set_id") REFERENCES "adsets"("id") ON DELETE CASCADE,
    CONSTRAINT "fk_ads_ad_creatives_creative_id" FOREIGN KEY ("creative_id") REFERENCES "ad_creatives"("id") ON DELETE CASCADE,
    CONSTRAINT "fk_ads_users_created_by" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE CASCADE,
    CONSTRAINT "fk_ads_users_updated_by" FOREIGN KEY ("updated_by") REFERENCES "users"("id") ON DELETE CASCADE,
    CONSTRAINT "fk_ads_users_published_by" FOREIGN KEY ("published_by") REFERENCES "users"("id") ON DELETE SET NULL
);

-- Create Table: ad_labels
CREATE TABLE "ad_labels" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "ad_id" UUID NOT NULL,
    "name" VARCHAR NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "pk_ad_labels" PRIMARY KEY ("id"),
    CONSTRAINT "fk_ad_labels_ads_ad_id" FOREIGN KEY ("ad_id") REFERENCES "ads"("id") ON DELETE CASCADE
);

-- Create Table: ad_tags
CREATE TABLE "ad_tags" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "ad_id" UUID NOT NULL,
    "name" VARCHAR NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "pk_ad_tags" PRIMARY KEY ("id"),
    CONSTRAINT "fk_ad_tags_ads_ad_id" FOREIGN KEY ("ad_id") REFERENCES "ads"("id") ON DELETE CASCADE
);

-- Create Table: ad_histories
CREATE TABLE "ad_histories" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "ad_id" UUID NOT NULL,
    "version" INT NOT NULL,
    "snapshot" JSONB NOT NULL,
    "author_id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "pk_ad_histories" PRIMARY KEY ("id"),
    CONSTRAINT "fk_ad_histories_ads_ad_id" FOREIGN KEY ("ad_id") REFERENCES "ads"("id") ON DELETE CASCADE,
    CONSTRAINT "fk_ad_histories_users_author_id" FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE CASCADE
);
