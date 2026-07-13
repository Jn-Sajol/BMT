-- CreateTable
CREATE TABLE "automation_timeline_events" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "event_name" TEXT NOT NULL,
    "workspace_id" UUID NOT NULL,
    "correlation_id" UUID NOT NULL,
    "causation_id" UUID NOT NULL,
    "payload" JSONB NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "automation_timeline_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "automation_rule_performance_projections" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "rule_id" UUID NOT NULL,
    "workspace_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "executions_count" INTEGER NOT NULL DEFAULT 0,
    "success_count" INTEGER NOT NULL DEFAULT 0,
    "failed_count" INTEGER NOT NULL DEFAULT 0,
    "last_executed_at" TIMESTAMPTZ,
    "average_duration_ms" DOUBLE PRECISION NOT NULL DEFAULT 0.0,

    CONSTRAINT "automation_rule_performance_projections_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "automation_action_performance_projections" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "action_type" TEXT NOT NULL,
    "workspace_id" UUID NOT NULL,
    "executions_count" INTEGER NOT NULL DEFAULT 0,
    "success_count" INTEGER NOT NULL DEFAULT 0,
    "failed_count" INTEGER NOT NULL DEFAULT 0,
    "average_duration_ms" DOUBLE PRECISION NOT NULL DEFAULT 0.0,

    CONSTRAINT "automation_action_performance_projections_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "automation_trigger_performance_projections" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "trigger_type" TEXT NOT NULL,
    "workspace_id" UUID NOT NULL,
    "matched_count" INTEGER NOT NULL DEFAULT 0,
    "last_matched_at" TIMESTAMPTZ,

    CONSTRAINT "automation_trigger_performance_projections_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "automation_execution_performance_projections" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "workspace_id" UUID NOT NULL,
    "correlation_id" UUID NOT NULL,
    "rule_id" UUID NOT NULL,
    "status" TEXT NOT NULL,
    "duration_ms" INTEGER NOT NULL,
    "started_at" TIMESTAMPTZ NOT NULL,
    "completed_at" TIMESTAMPTZ,

    CONSTRAINT "automation_execution_performance_projections_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "automation_aggregated_stats" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "workspace_id" UUID NOT NULL,
    "rule_id" UUID,
    "period" TEXT NOT NULL,
    "timestamp" TIMESTAMPTZ NOT NULL,
    "executions_count" INTEGER NOT NULL DEFAULT 0,
    "success_count" INTEGER NOT NULL DEFAULT 0,
    "failed_count" INTEGER NOT NULL DEFAULT 0,
    "average_duration_ms" DOUBLE PRECISION NOT NULL DEFAULT 0.0,

    CONSTRAINT "automation_aggregated_stats_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "automation_rule_performance_projections_rule_id_key" ON "automation_rule_performance_projections"("rule_id");

-- CreateIndex
CREATE UNIQUE INDEX "automation_action_performance_projections_workspace_id_action_t" ON "automation_action_performance_projections"("workspace_id", "action_type");

-- CreateIndex
CREATE UNIQUE INDEX "automation_trigger_performance_projections_workspace_id_trigger_" ON "automation_trigger_performance_projections"("workspace_id", "trigger_type");

-- CreateIndex
CREATE UNIQUE INDEX "automation_execution_performance_projections_correlation_id_key" ON "automation_execution_performance_projections"("correlation_id");

-- CreateIndex
CREATE UNIQUE INDEX "automation_aggregated_stats_workspace_id_rule_id_period_timesta" ON "automation_aggregated_stats"("workspace_id", "rule_id", "period", "timestamp");
