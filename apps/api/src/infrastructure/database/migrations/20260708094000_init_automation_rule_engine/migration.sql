-- Create Table automation_rules
CREATE TABLE "automation_rules" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "workspace_id" UUID NOT NULL,
    "name" VARCHAR NOT NULL,
    "description" TEXT,
    "status" VARCHAR NOT NULL DEFAULT 'DRAFT',
    "schema_version" INTEGER NOT NULL DEFAULT 1,
    "created_by" UUID NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now(),

    CONSTRAINT "pk_automation_rules" PRIMARY KEY ("id"),
    CONSTRAINT "fk_automation_rules_workspaces_workspace_id" FOREIGN KEY ("workspace_id") REFERENCES "workspaces"("id") ON DELETE CASCADE,
    CONSTRAINT "uq_automation_rules_workspace_id_name" UNIQUE ("workspace_id", "name")
);

-- Create Table automation_rule_versions
CREATE TABLE "automation_rule_versions" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "rule_id" UUID NOT NULL,
    "version" INTEGER NOT NULL,
    "trigger" JSONB NOT NULL,
    "conditions" JSONB NOT NULL,
    "actions" JSONB NOT NULL,
    "ast" JSONB NOT NULL,
    "status" VARCHAR NOT NULL DEFAULT 'DRAFT',
    "created_by" UUID NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),

    CONSTRAINT "pk_automation_rule_versions" PRIMARY KEY ("id"),
    CONSTRAINT "fk_automation_rule_versions_automation_rules_rule_id" FOREIGN KEY ("rule_id") REFERENCES "automation_rules"("id") ON DELETE CASCADE,
    CONSTRAINT "uq_automation_rule_versions_rule_id_version" UNIQUE ("rule_id", "version")
);

-- Create Table automation_execution_contexts
CREATE TABLE "automation_execution_contexts" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "rule_id" UUID NOT NULL,
    "version_id" UUID NOT NULL,
    "trigger_type" VARCHAR NOT NULL,
    "trigger_event" JSONB NOT NULL,
    "correlation_id" UUID NOT NULL,
    "matched_entities" JSONB NOT NULL,
    "started_at" TIMESTAMPTZ NOT NULL,
    "finished_at" TIMESTAMPTZ,

    CONSTRAINT "pk_automation_execution_contexts" PRIMARY KEY ("id")
);

-- Create Table automation_audit_logs
CREATE TABLE "automation_audit_logs" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "rule_id" UUID NOT NULL,
    "version_id" UUID NOT NULL,
    "workspace_id" UUID NOT NULL,
    "context_id" UUID,
    "idempotency_key" VARCHAR,
    "execution_status" VARCHAR NOT NULL,
    "trigger_evaluated" BOOLEAN NOT NULL,
    "conditions_matched" BOOLEAN NOT NULL,
    "actions_taken" JSONB NOT NULL,
    "error_message" TEXT,
    "rule_snapshot" JSONB NOT NULL,
    "explainability" JSONB,
    "duration_ms" INTEGER,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),

    CONSTRAINT "pk_automation_audit_logs" PRIMARY KEY ("id"),
    CONSTRAINT "fk_automation_audit_logs_automation_rules_rule_id" FOREIGN KEY ("rule_id") REFERENCES "automation_rules"("id") ON DELETE CASCADE,
    CONSTRAINT "uq_automation_audit_logs_idempotency_key" UNIQUE ("idempotency_key")
);
