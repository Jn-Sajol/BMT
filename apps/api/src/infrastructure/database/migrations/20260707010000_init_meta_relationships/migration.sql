-- Create Table: meta_business_pages
CREATE TABLE "meta_business_pages" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "workspace_id" UUID NOT NULL,
    "organization_id" UUID NOT NULL,
    "source_external_id" VARCHAR NOT NULL,
    "target_external_id" VARCHAR NOT NULL,
    "provider" VARCHAR NOT NULL DEFAULT 'meta',
    "status" VARCHAR NOT NULL DEFAULT 'ACTIVE',
    "synced_at" TIMESTAMPTZ NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMPTZ,

    CONSTRAINT "pk_meta_business_pages" PRIMARY KEY ("id"),
    CONSTRAINT "fk_meta_business_pages_workspaces_workspace_id" FOREIGN KEY ("workspace_id") REFERENCES "workspaces"("id") ON DELETE CASCADE,
    CONSTRAINT "fk_meta_business_pages_organizations_organization_id" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE CASCADE
);
CREATE UNIQUE INDEX "udx_meta_business_pages_source_target_provider_workspace" ON "meta_business_pages"("source_external_id", "target_external_id", "provider", "workspace_id");

-- Create Table: meta_business_ad_accounts
CREATE TABLE "meta_business_ad_accounts" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "workspace_id" UUID NOT NULL,
    "organization_id" UUID NOT NULL,
    "source_external_id" VARCHAR NOT NULL,
    "target_external_id" VARCHAR NOT NULL,
    "provider" VARCHAR NOT NULL DEFAULT 'meta',
    "status" VARCHAR NOT NULL DEFAULT 'ACTIVE',
    "synced_at" TIMESTAMPTZ NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMPTZ,

    CONSTRAINT "pk_meta_business_ad_accounts" PRIMARY KEY ("id"),
    CONSTRAINT "fk_meta_business_ad_accounts_workspaces_workspace_id" FOREIGN KEY ("workspace_id") REFERENCES "workspaces"("id") ON DELETE CASCADE,
    CONSTRAINT "fk_meta_business_ad_accounts_organizations_organization_id" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE CASCADE
);
CREATE UNIQUE INDEX "udx_meta_business_ad_accounts_source_target_provider_workspace" ON "meta_business_ad_accounts"("source_external_id", "target_external_id", "provider", "workspace_id");

-- Create Table: meta_business_pixels
CREATE TABLE "meta_business_pixels" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "workspace_id" UUID NOT NULL,
    "organization_id" UUID NOT NULL,
    "source_external_id" VARCHAR NOT NULL,
    "target_external_id" VARCHAR NOT NULL,
    "provider" VARCHAR NOT NULL DEFAULT 'meta',
    "status" VARCHAR NOT NULL DEFAULT 'ACTIVE',
    "synced_at" TIMESTAMPTZ NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMPTZ,

    CONSTRAINT "pk_meta_business_pixels" PRIMARY KEY ("id"),
    CONSTRAINT "fk_meta_business_pixels_workspaces_workspace_id" FOREIGN KEY ("workspace_id") REFERENCES "workspaces"("id") ON DELETE CASCADE,
    CONSTRAINT "fk_meta_business_pixels_organizations_organization_id" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE CASCADE
);
CREATE UNIQUE INDEX "udx_meta_business_pixels_source_target_provider_workspace" ON "meta_business_pixels"("source_external_id", "target_external_id", "provider", "workspace_id");

-- Create Table: meta_business_catalogs
CREATE TABLE "meta_business_catalogs" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "workspace_id" UUID NOT NULL,
    "organization_id" UUID NOT NULL,
    "source_external_id" VARCHAR NOT NULL,
    "target_external_id" VARCHAR NOT NULL,
    "provider" VARCHAR NOT NULL DEFAULT 'meta',
    "status" VARCHAR NOT NULL DEFAULT 'ACTIVE',
    "synced_at" TIMESTAMPTZ NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMPTZ,

    CONSTRAINT "pk_meta_business_catalogs" PRIMARY KEY ("id"),
    CONSTRAINT "fk_meta_business_catalogs_workspaces_workspace_id" FOREIGN KEY ("workspace_id") REFERENCES "workspaces"("id") ON DELETE CASCADE,
    CONSTRAINT "fk_meta_business_catalogs_organizations_organization_id" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE CASCADE
);
CREATE UNIQUE INDEX "udx_meta_business_catalogs_source_target_provider_workspace" ON "meta_business_catalogs"("source_external_id", "target_external_id", "provider", "workspace_id");

-- Create Table: meta_page_instagrams
CREATE TABLE "meta_page_instagrams" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "workspace_id" UUID NOT NULL,
    "organization_id" UUID NOT NULL,
    "source_external_id" VARCHAR NOT NULL,
    "target_external_id" VARCHAR NOT NULL,
    "provider" VARCHAR NOT NULL DEFAULT 'meta',
    "status" VARCHAR NOT NULL DEFAULT 'ACTIVE',
    "synced_at" TIMESTAMPTZ NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMPTZ,

    CONSTRAINT "pk_meta_page_instagrams" PRIMARY KEY ("id"),
    CONSTRAINT "fk_meta_page_instagrams_workspaces_workspace_id" FOREIGN KEY ("workspace_id") REFERENCES "workspaces"("id") ON DELETE CASCADE,
    CONSTRAINT "fk_meta_page_instagrams_organizations_organization_id" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE CASCADE
);
CREATE UNIQUE INDEX "udx_meta_page_instagrams_source_target_provider_workspace" ON "meta_page_instagrams"("source_external_id", "target_external_id", "provider", "workspace_id");

-- Create Table: meta_ad_account_pixels
CREATE TABLE "meta_ad_account_pixels" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "workspace_id" UUID NOT NULL,
    "organization_id" UUID NOT NULL,
    "source_external_id" VARCHAR NOT NULL,
    "target_external_id" VARCHAR NOT NULL,
    "provider" VARCHAR NOT NULL DEFAULT 'meta',
    "status" VARCHAR NOT NULL DEFAULT 'ACTIVE',
    "synced_at" TIMESTAMPTZ NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMPTZ,

    CONSTRAINT "pk_meta_ad_account_pixels" PRIMARY KEY ("id"),
    CONSTRAINT "fk_meta_ad_account_pixels_workspaces_workspace_id" FOREIGN KEY ("workspace_id") REFERENCES "workspaces"("id") ON DELETE CASCADE,
    CONSTRAINT "fk_meta_ad_account_pixels_organizations_organization_id" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE CASCADE
);
CREATE UNIQUE INDEX "udx_meta_ad_account_pixels_source_target_provider_workspace" ON "meta_ad_account_pixels"("source_external_id", "target_external_id", "provider", "workspace_id");
