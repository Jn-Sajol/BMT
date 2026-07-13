-- Create Table: organizations
CREATE TABLE "organizations" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" VARCHAR NOT NULL,
    "slug" VARCHAR NOT NULL,
    "status" VARCHAR NOT NULL DEFAULT 'ACTIVE',
    "owner_user_id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMPTZ,

    CONSTRAINT "pk_organizations" PRIMARY KEY ("id"),
    CONSTRAINT "fk_organizations_users_owner_user_id" FOREIGN KEY ("owner_user_id") REFERENCES "users"("id") ON DELETE RESTRICT
);

-- Create Unique Index
CREATE UNIQUE INDEX "udx_organizations_slug" ON "organizations"("slug");

-- Add ForeignKey constraint on user_invitations pointing to organizations
ALTER TABLE "user_invitations" ADD CONSTRAINT "fk_user_invitations_organizations_tenant_id" FOREIGN KEY ("tenant_id") REFERENCES "organizations"("id") ON DELETE SET NULL;
