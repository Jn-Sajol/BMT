-- Alter Table campaigns
ALTER TABLE "campaigns" ADD COLUMN "effective_status" VARCHAR;
ALTER TABLE "campaigns" ADD COLUMN "review_status" VARCHAR;
ALTER TABLE "campaigns" ADD COLUMN "delivery_status" VARCHAR;
ALTER TABLE "campaigns" ADD COLUMN "last_synced_at" TIMESTAMPTZ;
ALTER TABLE "campaigns" ADD COLUMN "status_raw_payload" JSONB;

-- Alter Table adsets
ALTER TABLE "adsets" ADD COLUMN "effective_status" VARCHAR;
ALTER TABLE "adsets" ADD COLUMN "review_status" VARCHAR;
ALTER TABLE "adsets" ADD COLUMN "delivery_status" VARCHAR;
ALTER TABLE "adsets" ADD COLUMN "last_synced_at" TIMESTAMPTZ;
ALTER TABLE "adsets" ADD COLUMN "status_raw_payload" JSONB;

-- Alter Table ads
ALTER TABLE "ads" ADD COLUMN "effective_status" VARCHAR;
ALTER TABLE "ads" ADD COLUMN "last_synced_at" TIMESTAMPTZ;
ALTER TABLE "ads" ADD COLUMN "status_raw_payload" JSONB;

-- Create Table status_sync_histories
CREATE TABLE "status_sync_histories" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "workspace_id" UUID NOT NULL,
    "status" VARCHAR NOT NULL DEFAULT 'RUNNING',
    "started_at" TIMESTAMPTZ NOT NULL,
    "finished_at" TIMESTAMPTZ,
    "records_processed" INT NOT NULL DEFAULT 0,
    "records_updated" INT NOT NULL DEFAULT 0,
    "duration" INT,
    "error_message" VARCHAR,

    CONSTRAINT "pk_status_sync_histories" PRIMARY KEY ("id"),
    CONSTRAINT "fk_status_sync_histories_workspaces_workspace_id" FOREIGN KEY ("workspace_id") REFERENCES "workspaces"("id") ON DELETE CASCADE
);
