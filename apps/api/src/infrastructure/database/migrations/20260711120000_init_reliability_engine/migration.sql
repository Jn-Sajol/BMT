-- CreateTable
CREATE TABLE "automation_retry_queue" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "workspace_id" UUID NOT NULL,
    "provider" TEXT NOT NULL,
    "provider_account_id" TEXT NOT NULL,
    "event_name" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "correlation_id" UUID NOT NULL,
    "causation_id" UUID NOT NULL,
    "action_id" UUID,
    "retry_count" INTEGER NOT NULL DEFAULT 0,
    "max_retries" INTEGER NOT NULL DEFAULT 5,
    "next_retry_at" TIMESTAMPTZ NOT NULL,
    "status" TEXT NOT NULL,
    "priority" TEXT NOT NULL DEFAULT 'NORMAL',
    "idempotency_key" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "automation_retry_queue_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "automation_dead_letters" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "workspace_id" UUID NOT NULL,
    "provider" TEXT NOT NULL,
    "event_name" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "correlation_id" UUID NOT NULL,
    "causation_id" UUID NOT NULL,
    "reason" TEXT NOT NULL,
    "retry_count" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "automation_dead_letters_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "automation_circuit_breakers" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "provider" TEXT NOT NULL,
    "provider_account_id" TEXT NOT NULL,
    "workspace_id" UUID NOT NULL,
    "status" TEXT NOT NULL,
    "failure_count" INTEGER NOT NULL DEFAULT 0,
    "last_failure_at" TIMESTAMPTZ,
    "next_attempt_at" TIMESTAMPTZ,
    "recovery_timeout_ms" INTEGER NOT NULL DEFAULT 60000,
    "failure_threshold" INTEGER NOT NULL DEFAULT 5,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "automation_circuit_breakers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "automation_failure_history" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "workspace_id" UUID NOT NULL,
    "provider" TEXT NOT NULL,
    "classification" TEXT NOT NULL,
    "severity" TEXT NOT NULL,
    "error" TEXT NOT NULL,
    "correlation_id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "automation_failure_history_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "automation_retry_queue_idempotency_key_key" ON "automation_retry_queue"("idempotency_key");

-- CreateIndex
CREATE UNIQUE INDEX "automation_circuit_breakers_provider_provider_account_id_wo" ON "automation_circuit_breakers"("provider", "provider_account_id", "workspace_id");
