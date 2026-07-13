-- CreateTable
CREATE TABLE "automation_recommendations" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "workspace_id" UUID NOT NULL,
    "provider" TEXT NOT NULL,
    "recommendation_type" TEXT NOT NULL,
    "entity_type" TEXT NOT NULL,
    "entity_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "confidence_score" DOUBLE PRECISION NOT NULL,
    "expected_impact" TEXT NOT NULL,
    "priority" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "recommendation_hash" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expires_at" TIMESTAMPTZ,
    "metadata" JSONB NOT NULL,
    "explainability" JSONB NOT NULL,

    CONSTRAINT "automation_recommendations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "automation_recommendation_history" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "recommendation_id" UUID NOT NULL,
    "status" TEXT NOT NULL,
    "action_by" UUID,
    "action_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "automation_recommendation_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "automation_optimization_scores" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "workspace_id" UUID NOT NULL,
    "score" DOUBLE PRECISION NOT NULL,
    "health_score" DOUBLE PRECISION NOT NULL,
    "potential_savings" DOUBLE PRECISION NOT NULL,
    "potential_revenue" DOUBLE PRECISION NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "automation_optimization_scores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "automation_recommendation_templates" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,
    "title_template" TEXT NOT NULL,
    "description_template" TEXT NOT NULL,
    "reason_template" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "automation_recommendation_templates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "automation_recommendation_dashboard_projections" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "workspace_id" UUID NOT NULL,
    "optimization_score" DOUBLE PRECISION NOT NULL,
    "automation_health" DOUBLE PRECISION NOT NULL,
    "potential_savings" DOUBLE PRECISION NOT NULL,
    "potential_revenue" DOUBLE PRECISION NOT NULL,
    "accepted_count" INTEGER NOT NULL DEFAULT 0,
    "rejected_count" INTEGER NOT NULL DEFAULT 0,
    "pending_count" INTEGER NOT NULL DEFAULT 0,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "automation_recommendation_dashboard_projections_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "automation_recommendations_recommendation_hash_key" ON "automation_recommendations"("recommendation_hash");

-- CreateIndex
CREATE UNIQUE INDEX "automation_recommendation_templates_name_version_key" ON "automation_recommendation_templates"("name", "version");

-- CreateIndex
CREATE UNIQUE INDEX "automation_recommendation_dashboard_projections_workspace_i_key" ON "automation_recommendation_dashboard_projections"("workspace_id");

-- AddForeignKey
ALTER TABLE "automation_recommendation_history" ADD CONSTRAINT "automation_recommendation_history_recommendation_id_fkey" FOREIGN KEY ("recommendation_id") REFERENCES "automation_recommendations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
