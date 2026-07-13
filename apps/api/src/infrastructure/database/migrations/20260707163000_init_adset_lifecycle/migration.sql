-- Create Table adset_lifecycle_histories
CREATE TABLE "adset_lifecycle_histories" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "ad_set_id" UUID NOT NULL,
    "action" VARCHAR NOT NULL,
    "before_status" VARCHAR NOT NULL,
    "after_status" VARCHAR NOT NULL,
    "performed_by" UUID NOT NULL,
    "performed_at" TIMESTAMPTZ NOT NULL,
    "meta_response" JSONB,

    CONSTRAINT "pk_adset_lifecycle_histories" PRIMARY KEY ("id"),
    CONSTRAINT "fk_adset_lifecycle_histories_adsets_ad_set_id" FOREIGN KEY ("ad_set_id") REFERENCES "adsets"("id") ON DELETE CASCADE,
    CONSTRAINT "fk_adset_lifecycle_histories_users_performed_by" FOREIGN KEY ("performed_by") REFERENCES "users"("id") ON DELETE CASCADE
);
