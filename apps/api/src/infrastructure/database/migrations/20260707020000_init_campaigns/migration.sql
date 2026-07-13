-- Create Enum Types
CREATE TYPE "campaign_objective" AS ENUM ('AWARENESS', 'TRAFFIC', 'ENGAGEMENT', 'LEADS', 'APP_PROMOTION', 'SALES');
CREATE TYPE "campaign_status" AS ENUM ('DRAFT', 'READY', 'PUBLISHED', 'ARCHIVED', 'FAILED');

-- Create Table: campaigns
CREATE TABLE "campaigns" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "workspace_id" UUID NOT NULL,
    "organization_id" UUID NOT NULL,
    "meta_business_id" UUID NOT NULL,
    "meta_ad_account_id" UUID NOT NULL,
    "name" VARCHAR NOT NULL,
    "objective" "campaign_objective" NOT NULL,
    "buying_type" VARCHAR NOT NULL DEFAULT 'AUCTION',
    "special_ad_category" VARCHAR NOT NULL DEFAULT 'NONE',
    "status" "campaign_status" NOT NULL DEFAULT 'DRAFT',
    "draft_version" INT NOT NULL DEFAULT 1,
    "published_version" INT NOT NULL DEFAULT 0,
    "is_published" BOOLEAN NOT NULL DEFAULT FALSE,
    "created_by" UUID NOT NULL,
    "updated_by" UUID NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMPTZ,

    CONSTRAINT "pk_campaigns" PRIMARY KEY ("id"),
    CONSTRAINT "fk_campaigns_workspaces_workspace_id" FOREIGN KEY ("workspace_id") REFERENCES "workspaces"("id") ON DELETE CASCADE,
    CONSTRAINT "fk_campaigns_organizations_organization_id" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE CASCADE,
    CONSTRAINT "fk_campaigns_meta_businesses_meta_business_id" FOREIGN KEY ("meta_business_id") REFERENCES "meta_businesses"("id") ON DELETE CASCADE,
    CONSTRAINT "fk_campaigns_meta_ad_accounts_meta_ad_account_id" FOREIGN KEY ("meta_ad_account_id") REFERENCES "meta_ad_accounts"("id") ON DELETE CASCADE,
    CONSTRAINT "fk_campaigns_users_created_by" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE CASCADE,
    CONSTRAINT "fk_campaigns_users_updated_by" FOREIGN KEY ("updated_by") REFERENCES "users"("id") ON DELETE CASCADE
);

-- Create Table: campaign_labels
CREATE TABLE "campaign_labels" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "campaign_id" UUID NOT NULL,
    "name" VARCHAR NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "pk_campaign_labels" PRIMARY KEY ("id"),
    CONSTRAINT "fk_campaign_labels_campaigns_campaign_id" FOREIGN KEY ("campaign_id") REFERENCES "campaigns"("id") ON DELETE CASCADE
);

-- Create Table: campaign_tags
CREATE TABLE "campaign_tags" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "campaign_id" UUID NOT NULL,
    "name" VARCHAR NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "pk_campaign_tags" PRIMARY KEY ("id"),
    CONSTRAINT "fk_campaign_tags_campaigns_campaign_id" FOREIGN KEY ("campaign_id") REFERENCES "campaigns"("id") ON DELETE CASCADE
);

-- Create Table: campaign_histories
CREATE TABLE "campaign_histories" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "campaign_id" UUID NOT NULL,
    "version" INT NOT NULL,
    "snapshot" JSONB NOT NULL,
    "author_id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "pk_campaign_histories" PRIMARY KEY ("id"),
    CONSTRAINT "fk_campaign_histories_campaigns_campaign_id" FOREIGN KEY ("campaign_id") REFERENCES "campaigns"("id") ON DELETE CASCADE,
    CONSTRAINT "fk_campaign_histories_users_author_id" FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE CASCADE
);
