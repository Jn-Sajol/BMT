-- Create Table: meta_businesses
CREATE TABLE "meta_businesses" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "workspace_id" UUID NOT NULL,
    "organization_id" UUID NOT NULL,
    "provider" VARCHAR NOT NULL DEFAULT 'meta',
    "external_id" VARCHAR NOT NULL,
    "name" VARCHAR NOT NULL,
    "status" VARCHAR NOT NULL DEFAULT 'ACTIVE',
    "raw_payload" JSONB NOT NULL,
    "synced_at" TIMESTAMPTZ NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMPTZ,

    CONSTRAINT "pk_meta_businesses" PRIMARY KEY ("id"),
    CONSTRAINT "fk_meta_businesses_workspaces_workspace_id" FOREIGN KEY ("workspace_id") REFERENCES "workspaces"("id") ON DELETE CASCADE,
    CONSTRAINT "fk_meta_businesses_organizations_organization_id" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE CASCADE
);
CREATE UNIQUE INDEX "udx_meta_businesses_external_id_provider_workspace_id" ON "meta_businesses"("external_id", "provider", "workspace_id");

-- Create Table: meta_pages
CREATE TABLE "meta_pages" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "workspace_id" UUID NOT NULL,
    "organization_id" UUID NOT NULL,
    "provider" VARCHAR NOT NULL DEFAULT 'meta',
    "external_id" VARCHAR NOT NULL,
    "name" VARCHAR NOT NULL,
    "status" VARCHAR NOT NULL DEFAULT 'ACTIVE',
    "raw_payload" JSONB NOT NULL,
    "synced_at" TIMESTAMPTZ NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMPTZ,

    CONSTRAINT "pk_meta_pages" PRIMARY KEY ("id"),
    CONSTRAINT "fk_meta_pages_workspaces_workspace_id" FOREIGN KEY ("workspace_id") REFERENCES "workspaces"("id") ON DELETE CASCADE,
    CONSTRAINT "fk_meta_pages_organizations_organization_id" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE CASCADE
);
CREATE UNIQUE INDEX "udx_meta_pages_external_id_provider_workspace_id" ON "meta_pages"("external_id", "provider", "workspace_id");

-- Create Table: meta_ad_accounts
CREATE TABLE "meta_ad_accounts" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "workspace_id" UUID NOT NULL,
    "organization_id" UUID NOT NULL,
    "provider" VARCHAR NOT NULL DEFAULT 'meta',
    "external_id" VARCHAR NOT NULL,
    "name" VARCHAR NOT NULL,
    "status" VARCHAR NOT NULL DEFAULT 'ACTIVE',
    "raw_payload" JSONB NOT NULL,
    "synced_at" TIMESTAMPTZ NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMPTZ,

    CONSTRAINT "pk_meta_ad_accounts" PRIMARY KEY ("id"),
    CONSTRAINT "fk_meta_ad_accounts_workspaces_workspace_id" FOREIGN KEY ("workspace_id") REFERENCES "workspaces"("id") ON DELETE CASCADE,
    CONSTRAINT "fk_meta_ad_accounts_organizations_organization_id" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE CASCADE
);
CREATE UNIQUE INDEX "udx_meta_ad_accounts_external_id_provider_workspace_id" ON "meta_ad_accounts"("external_id", "provider", "workspace_id");

-- Create Table: meta_instagram_accounts
CREATE TABLE "meta_instagram_accounts" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "workspace_id" UUID NOT NULL,
    "organization_id" UUID NOT NULL,
    "provider" VARCHAR NOT NULL DEFAULT 'meta',
    "external_id" VARCHAR NOT NULL,
    "name" VARCHAR NOT NULL,
    "status" VARCHAR NOT NULL DEFAULT 'ACTIVE',
    "raw_payload" JSONB NOT NULL,
    "synced_at" TIMESTAMPTZ NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMPTZ,

    CONSTRAINT "pk_meta_instagram_accounts" PRIMARY KEY ("id"),
    CONSTRAINT "fk_meta_instagram_accounts_workspaces_workspace_id" FOREIGN KEY ("workspace_id") REFERENCES "workspaces"("id") ON DELETE CASCADE,
    CONSTRAINT "fk_meta_instagram_accounts_organizations_organization_id" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE CASCADE
);
CREATE UNIQUE INDEX "udx_meta_instagram_accounts_external_id_provider_workspace_id" ON "meta_instagram_accounts"("external_id", "provider", "workspace_id");

-- Create Table: meta_pixels
CREATE TABLE "meta_pixels" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "workspace_id" UUID NOT NULL,
    "organization_id" UUID NOT NULL,
    "provider" VARCHAR NOT NULL DEFAULT 'meta',
    "external_id" VARCHAR NOT NULL,
    "name" VARCHAR NOT NULL,
    "status" VARCHAR NOT NULL DEFAULT 'ACTIVE',
    "raw_payload" JSONB NOT NULL,
    "synced_at" TIMESTAMPTZ NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMPTZ,

    CONSTRAINT "pk_meta_pixels" PRIMARY KEY ("id"),
    CONSTRAINT "fk_meta_pixels_workspaces_workspace_id" FOREIGN KEY ("workspace_id") REFERENCES "workspaces"("id") ON DELETE CASCADE,
    CONSTRAINT "fk_meta_pixels_organizations_organization_id" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE CASCADE
);
CREATE UNIQUE INDEX "udx_meta_pixels_external_id_provider_workspace_id" ON "meta_pixels"("external_id", "provider", "workspace_id");

-- Create Table: meta_catalogs
CREATE TABLE "meta_catalogs" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "workspace_id" UUID NOT NULL,
    "organization_id" UUID NOT NULL,
    "provider" VARCHAR NOT NULL DEFAULT 'meta',
    "external_id" VARCHAR NOT NULL,
    "name" VARCHAR NOT NULL,
    "status" VARCHAR NOT NULL DEFAULT 'ACTIVE',
    "raw_payload" JSONB NOT NULL,
    "synced_at" TIMESTAMPTZ NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMPTZ,

    CONSTRAINT "pk_meta_catalogs" PRIMARY KEY ("id"),
    CONSTRAINT "fk_meta_catalogs_workspaces_workspace_id" FOREIGN KEY ("workspace_id") REFERENCES "workspaces"("id") ON DELETE CASCADE,
    CONSTRAINT "fk_meta_catalogs_organizations_organization_id" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE CASCADE
);
CREATE UNIQUE INDEX "udx_meta_catalogs_external_id_provider_workspace_id" ON "meta_catalogs"("external_id", "provider", "workspace_id");

-- Create Table: meta_sync_histories
CREATE TABLE "meta_sync_histories" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "workspace_id" UUID NOT NULL,
    "organization_id" UUID NOT NULL,
    "started_at" TIMESTAMPTZ NOT NULL,
    "finished_at" TIMESTAMPTZ,
    "duration" INT,
    "asset_count" INT NOT NULL DEFAULT 0,
    "status" VARCHAR NOT NULL DEFAULT 'RUNNING',
    "error" TEXT,

    CONSTRAINT "pk_meta_sync_histories" PRIMARY KEY ("id"),
    CONSTRAINT "fk_meta_sync_histories_workspaces_workspace_id" FOREIGN KEY ("workspace_id") REFERENCES "workspaces"("id") ON DELETE CASCADE,
    CONSTRAINT "fk_meta_sync_histories_organizations_organization_id" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE CASCADE
);
