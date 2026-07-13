-- CreateTable
CREATE TABLE "automation_schedules" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "workspace_id" UUID NOT NULL,
    "provider" TEXT NOT NULL,
    "rule_id" UUID NOT NULL,
    "cron_expression" TEXT,
    "timezone" TEXT NOT NULL,
    "schedule_type" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "next_run_at_utc" TIMESTAMPTZ,
    "last_run_at_utc" TIMESTAMPTZ,
    "start_date" TIMESTAMPTZ,
    "end_date" TIMESTAMPTZ,
    "metadata" JSONB,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "automation_schedules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "automation_schedule_executions" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "workspace_id" UUID NOT NULL,
    "schedule_id" UUID NOT NULL,
    "correlation_id" UUID NOT NULL,
    "node_id" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "started_at" TIMESTAMPTZ NOT NULL,
    "completed_at" TIMESTAMPTZ,
    "duration_ms" INTEGER NOT NULL DEFAULT 0,
    "retry_count" INTEGER NOT NULL DEFAULT 0,
    "error" TEXT,
    "metadata" JSONB,

    CONSTRAINT "automation_schedule_executions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "automation_schedule_locks" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "schedule_id" UUID NOT NULL,
    "owner_node_id" TEXT NOT NULL,
    "lease_expires_at" TIMESTAMPTZ NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "automation_schedule_locks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "automation_scheduler_nodes" (
    "id" TEXT NOT NULL,
    "hostname" TEXT NOT NULL,
    "process_id" INTEGER NOT NULL,
    "heartbeat_at" TIMESTAMPTZ NOT NULL,
    "version" TEXT NOT NULL,
    "status" TEXT NOT NULL,

    CONSTRAINT "automation_scheduler_nodes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "automation_schedule_locks_schedule_id_key" ON "automation_schedule_locks"("schedule_id");

-- AddForeignKey
ALTER TABLE "automation_schedule_executions" ADD CONSTRAINT "automation_schedule_executions_schedule_id_fkey" FOREIGN KEY ("schedule_id") REFERENCES "automation_schedules"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "automation_schedule_locks" ADD CONSTRAINT "automation_schedule_locks_schedule_id_fkey" FOREIGN KEY ("schedule_id") REFERENCES "automation_schedules"("id") ON DELETE CASCADE ON UPDATE CASCADE;
