-- CreateTable
CREATE TABLE "automation_templates" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "workspace_id" UUID,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "visibility" TEXT NOT NULL,
    "active_version" TEXT NOT NULL DEFAULT '1.0.0',
    "author_id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "automation_templates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "automation_template_versions" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "template_id" UUID NOT NULL,
    "version" TEXT NOT NULL,
    "canvas_json" JSONB NOT NULL,
    "definition_json" JSONB NOT NULL,
    "checksum" TEXT NOT NULL,
    "signature" TEXT NOT NULL,
    "changelog" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "automation_template_versions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "automation_template_installations" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "template_id" UUID NOT NULL,
    "workspace_id" UUID NOT NULL,
    "installed_version" TEXT NOT NULL,
    "installed_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" TEXT NOT NULL,

    CONSTRAINT "automation_template_installations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "automation_template_analytics" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "template_id" UUID NOT NULL,
    "installs" INTEGER NOT NULL DEFAULT 0,
    "clones" INTEGER NOT NULL DEFAULT 0,
    "executions" INTEGER NOT NULL DEFAULT 0,
    "success_rate" DOUBLE PRECISION NOT NULL DEFAULT 1.0,
    "average_roi" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "automation_template_analytics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "automation_template_reviews" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "template_id" UUID NOT NULL,
    "workspace_id" UUID NOT NULL,
    "rating" INTEGER NOT NULL,
    "comment" TEXT,
    "is_verified" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "automation_template_reviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "automation_template_categories" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,

    CONSTRAINT "automation_template_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "automation_template_tags" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,

    CONSTRAINT "automation_template_tags_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "automation_template_versions_template_id_version_key" ON "automation_template_versions"("template_id", "version");

-- CreateIndex
CREATE UNIQUE INDEX "automation_template_categories_name_key" ON "automation_template_categories"("name");

-- CreateIndex
CREATE UNIQUE INDEX "automation_template_tags_name_key" ON "automation_template_tags"("name");

-- AddForeignKey
ALTER TABLE "automation_template_versions" ADD CONSTRAINT "automation_template_versions_template_id_fkey" FOREIGN KEY ("template_id") REFERENCES "automation_templates"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "automation_template_installations" ADD CONSTRAINT "automation_template_installations_template_id_fkey" FOREIGN KEY ("template_id") REFERENCES "automation_templates"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "automation_template_analytics" ADD CONSTRAINT "automation_template_analytics_template_id_fkey" FOREIGN KEY ("template_id") REFERENCES "automation_templates"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "automation_template_reviews" ADD CONSTRAINT "automation_template_reviews_template_id_fkey" FOREIGN KEY ("template_id") REFERENCES "automation_templates"("id") ON DELETE CASCADE ON UPDATE CASCADE;
