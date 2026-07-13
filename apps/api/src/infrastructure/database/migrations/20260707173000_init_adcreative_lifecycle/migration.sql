-- Create Table ad_creative_lifecycle_histories
CREATE TABLE "ad_creative_lifecycle_histories" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "creative_id" UUID NOT NULL,
    "action" VARCHAR NOT NULL,
    "before_status" VARCHAR NOT NULL,
    "after_status" VARCHAR NOT NULL,
    "performed_by" UUID NOT NULL,
    "performed_at" TIMESTAMPTZ NOT NULL,
    "meta_response" JSONB,

    CONSTRAINT "pk_ad_creative_lifecycle_histories" PRIMARY KEY ("id"),
    CONSTRAINT "fk_ad_creative_lifecycle_histories_creatives_creative_id" FOREIGN KEY ("creative_id") REFERENCES "ad_creatives"("id") ON DELETE CASCADE,
    CONSTRAINT "fk_ad_creative_lifecycle_histories_users_performed_by" FOREIGN KEY ("performed_by") REFERENCES "users"("id") ON DELETE CASCADE
);
