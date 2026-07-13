-- Create Table campaign_lifecycle_histories
CREATE TABLE "campaign_lifecycle_histories" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "campaign_id" UUID NOT NULL,
    "action" VARCHAR NOT NULL,
    "before_status" VARCHAR NOT NULL,
    "after_status" VARCHAR NOT NULL,
    "performed_by" UUID NOT NULL,
    "performed_at" TIMESTAMPTZ NOT NULL,
    "meta_response" JSONB,

    CONSTRAINT "pk_campaign_lifecycle_histories" PRIMARY KEY ("id"),
    CONSTRAINT "fk_campaign_lifecycle_histories_campaigns_campaign_id" FOREIGN KEY ("campaign_id") REFERENCES "campaigns"("id") ON DELETE CASCADE,
    CONSTRAINT "fk_campaign_lifecycle_histories_users_performed_by" FOREIGN KEY ("performed_by") REFERENCES "users"("id") ON DELETE CASCADE
);
