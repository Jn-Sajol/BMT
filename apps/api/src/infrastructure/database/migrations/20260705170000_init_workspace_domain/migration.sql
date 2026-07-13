-- Create Enum Types
CREATE TYPE "WorkspaceType" AS ENUM ('SAFE', 'ADVANCED');
CREATE TYPE "WorkspaceStatus" AS ENUM ('ACTIVE', 'ARCHIVED', 'SUSPENDED');
CREATE TYPE "WorkspaceVisibility" AS ENUM ('PRIVATE', 'TEAM', 'ORGANIZATION');

-- Create Table: workspaces
CREATE TABLE "workspaces" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "organization_id" UUID NOT NULL,
    "name" VARCHAR NOT NULL,
    "slug" VARCHAR NOT NULL,
    "description" TEXT,
    "workspace_type" "WorkspaceType" NOT NULL,
    "visibility" "WorkspaceVisibility" NOT NULL DEFAULT 'ORGANIZATION',
    "status" "WorkspaceStatus" NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMPTZ,

    CONSTRAINT "pk_workspaces" PRIMARY KEY ("id"),
    CONSTRAINT "fk_workspaces_organizations_organization_id" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE CASCADE
);

-- Create Unique Constraint index
CREATE UNIQUE INDEX "udx_workspaces_organization_id_slug" ON "workspaces"("organization_id", "slug");

-- Create Table: workspace_settings
CREATE TABLE "workspace_settings" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "workspace_id" UUID NOT NULL,
    "timezone" VARCHAR NOT NULL DEFAULT 'UTC',
    "language" VARCHAR NOT NULL DEFAULT 'en',
    "date_format" VARCHAR NOT NULL DEFAULT 'YYYY-MM-DD',
    "time_format" VARCHAR NOT NULL DEFAULT 'HH:mm:ss',
    "theme" VARCHAR NOT NULL DEFAULT 'dark',
    "default_landing_page" VARCHAR NOT NULL DEFAULT '/dashboard',
    "notification_prefs" JSONB NOT NULL DEFAULT '{}',
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "pk_workspace_settings" PRIMARY KEY ("id"),
    CONSTRAINT "fk_workspace_settings_workspaces_workspace_id" FOREIGN KEY ("workspace_id") REFERENCES "workspaces"("id") ON DELETE CASCADE
);

-- Create Unique Index
CREATE UNIQUE INDEX "udx_workspace_settings_workspace_id" ON "workspace_settings"("workspace_id");

-- Create Table: workspace_preferences
CREATE TABLE "workspace_preferences" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "workspace_id" UUID NOT NULL,
    "preferences" JSONB NOT NULL DEFAULT '{}',
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "pk_workspace_preferences" PRIMARY KEY ("id"),
    CONSTRAINT "fk_workspace_preferences_workspaces_workspace_id" FOREIGN KEY ("workspace_id") REFERENCES "workspaces"("id") ON DELETE CASCADE
);

-- Create Unique Index
CREATE UNIQUE INDEX "udx_workspace_preferences_workspace_id" ON "workspace_preferences"("workspace_id");

-- Create Table: workspace_members
CREATE TABLE "workspace_members" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "workspace_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "pk_workspace_members" PRIMARY KEY ("id"),
    CONSTRAINT "fk_workspace_members_workspaces_workspace_id" FOREIGN KEY ("workspace_id") REFERENCES "workspaces"("id") ON DELETE CASCADE,
    CONSTRAINT "fk_workspace_members_users_user_id" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE
);

-- Create Unique composite Index
CREATE UNIQUE INDEX "udx_workspace_members_workspace_id_user_id" ON "workspace_members"("workspace_id", "user_id");
