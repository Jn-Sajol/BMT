-- Create Table meta_outbox_jobs
CREATE TABLE "meta_outbox_jobs" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "workspace_id" UUID NOT NULL,
    "provider" VARCHAR NOT NULL,
    "object_type" VARCHAR NOT NULL,
    "object_id" VARCHAR NOT NULL,
    "action" VARCHAR NOT NULL,
    "payload" JSONB NOT NULL,
    "priority" INTEGER NOT NULL DEFAULT 0,
    "correlation_id" UUID NOT NULL,
    "causation_id" UUID NOT NULL,
    "idempotency_key" VARCHAR NOT NULL,
    "status" VARCHAR NOT NULL DEFAULT 'PENDING',
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "max_attempts" INTEGER NOT NULL DEFAULT 5,
    "next_run_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
    "processed_at" TIMESTAMPTZ,
    "completed_at" TIMESTAMPTZ,
    "failed_at" TIMESTAMPTZ,
    "last_error" TEXT,
    "created_by" UUID NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now(),

    CONSTRAINT "pk_meta_outbox_jobs" PRIMARY KEY ("id"),
    CONSTRAINT "uq_meta_outbox_jobs_idempotency_key" UNIQUE ("idempotency_key")
);

CREATE INDEX "idx_meta_outbox_jobs_status_next_run" ON "meta_outbox_jobs"("status", "next_run_at");
CREATE INDEX "idx_meta_outbox_jobs_workspace_status" ON "meta_outbox_jobs"("workspace_id", "status");
CREATE INDEX "idx_meta_outbox_jobs_priority_next_run" ON "meta_outbox_jobs"("priority", "next_run_at");
CREATE INDEX "idx_meta_outbox_jobs_correlation" ON "meta_outbox_jobs"("correlation_id");
