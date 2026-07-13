-- CreateTable
CREATE TABLE "automation_insights_sync_cursors" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "workspace_id" UUID NOT NULL,
    "provider" TEXT NOT NULL,
    "sync_mode" TEXT NOT NULL,
    "last_successful_sync_at" TIMESTAMPTZ,
    "sync_cursor" TEXT,
    "page_cursor" TEXT,
    "checkpoint" JSONB,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "automation_insights_sync_cursors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "automation_insights_sync_runs" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "workspace_id" UUID NOT NULL,
    "provider" TEXT NOT NULL,
    "sync_mode" TEXT NOT NULL,
    "started_at" TIMESTAMPTZ NOT NULL,
    "finished_at" TIMESTAMPTZ,
    "status" TEXT NOT NULL,
    "pages_collected" INTEGER NOT NULL DEFAULT 0,
    "rows_normalized" INTEGER NOT NULL DEFAULT 0,
    "rows_inserted" INTEGER NOT NULL DEFAULT 0,
    "duplicates_skipped" INTEGER NOT NULL DEFAULT 0,
    "retry_count" INTEGER NOT NULL DEFAULT 0,
    "api_latency_ms" INTEGER NOT NULL DEFAULT 0,
    "error_message" TEXT,

    CONSTRAINT "automation_insights_sync_runs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "automation_canonical_metrics" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "workspace_id" UUID NOT NULL,
    "provider" TEXT NOT NULL,
    "entity_type" TEXT NOT NULL,
    "entity_id" TEXT NOT NULL,
    "metric_date" DATE NOT NULL,
    "granularity" TEXT NOT NULL,
    "metric_version" INTEGER NOT NULL DEFAULT 1,
    "impressions" INTEGER NOT NULL DEFAULT 0,
    "clicks" INTEGER NOT NULL DEFAULT 0,
    "reach" INTEGER NOT NULL DEFAULT 0,
    "frequency" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "spend" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "cpm" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "cpc" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "ctr" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "conversions" INTEGER NOT NULL DEFAULT 0,
    "video_views" INTEGER NOT NULL DEFAULT 0,
    "engagement" INTEGER NOT NULL DEFAULT 0,
    "raw_payload" JSONB,
    "source_payload_hash" TEXT NOT NULL,
    "source_request_id" TEXT NOT NULL,
    "ingested_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sync_run_id" UUID NOT NULL,

    CONSTRAINT "automation_canonical_metrics_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "automation_insights_sync_cursors_workspace_id_provider_sync" ON "automation_insights_sync_cursors"("workspace_id", "provider", "sync_mode");

-- CreateIndex
CREATE UNIQUE INDEX "automation_canonical_metrics_provider_entity_id_metric_date" ON "automation_canonical_metrics"("provider", "entity_id", "metric_date", "granularity", "metric_version");

-- AddForeignKey
ALTER TABLE "automation_canonical_metrics" ADD CONSTRAINT "automation_canonical_metrics_sync_run_id_fkey" FOREIGN KEY ("sync_run_id") REFERENCES "automation_insights_sync_runs"("id") ON DELETE CASCADE ON UPDATE CASCADE;
