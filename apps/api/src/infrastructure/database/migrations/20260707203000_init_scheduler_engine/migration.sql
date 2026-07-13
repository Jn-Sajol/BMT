-- Create Table jobs
CREATE TABLE "jobs" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" VARCHAR NOT NULL,
    "provider" VARCHAR NOT NULL,
    "payload" JSONB NOT NULL,
    "status" VARCHAR NOT NULL DEFAULT 'PENDING',
    "cron" VARCHAR,
    "correlation_id" UUID NOT NULL,
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "max_attempts" INTEGER NOT NULL DEFAULT 5,
    "error_message" TEXT,
    "run_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
    "last_run_at" TIMESTAMPTZ,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now(),

    CONSTRAINT "pk_jobs" PRIMARY KEY ("id")
);

-- Create Table job_histories
CREATE TABLE "job_histories" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "job_id" UUID NOT NULL,
    "status" VARCHAR NOT NULL,
    "attempt" INTEGER NOT NULL,
    "error_message" TEXT,
    "duration" INTEGER,
    "started_at" TIMESTAMPTZ NOT NULL,
    "finished_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "pk_job_histories" PRIMARY KEY ("id"),
    CONSTRAINT "fk_job_histories_jobs_job_id" FOREIGN KEY ("job_id") REFERENCES "jobs"("id") ON DELETE CASCADE
);

-- Create Table distributed_locks
CREATE TABLE "distributed_locks" (
    "lock_key" VARCHAR NOT NULL,
    "locked_by" UUID NOT NULL,
    "expires_at" TIMESTAMPTZ NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),

    CONSTRAINT "pk_distributed_locks" PRIMARY KEY ("lock_key")
);

CREATE INDEX "idx_jobs_status_run_at" ON "jobs"("status", "run_at");
