-- CreateTable
CREATE TABLE "automation_notifications" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "workspace_id" UUID NOT NULL,
    "event_name" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "severity" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "automation_notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "automation_notification_deliveries" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "notification_id" UUID NOT NULL,
    "channel" TEXT NOT NULL,
    "recipient" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "retry_count" INTEGER NOT NULL DEFAULT 0,
    "error" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "automation_notification_deliveries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "automation_notification_templates" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "subject" TEXT,
    "body" TEXT NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "automation_notification_templates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "automation_notification_preferences" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "workspace_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "channel" TEXT NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "severity_level" TEXT NOT NULL DEFAULT 'INFO',
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "automation_notification_preferences_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "automation_notification_providers" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "config" JSONB NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "automation_notification_providers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "automation_notification_templates_name_key" ON "automation_notification_templates"("name");

-- CreateIndex
CREATE UNIQUE INDEX "automation_notification_preferences_workspace_id_user_id_channel_key" ON "automation_notification_preferences"("workspace_id", "user_id", "channel");

-- CreateIndex
CREATE UNIQUE INDEX "automation_notification_providers_name_key" ON "automation_notification_providers"("name");

-- AddForeignKey
ALTER TABLE "automation_notification_deliveries" ADD CONSTRAINT "automation_notification_deliveries_notification_id_fkey" FOREIGN KEY ("notification_id") REFERENCES "automation_notifications"("id") ON DELETE CASCADE ON UPDATE CASCADE;
