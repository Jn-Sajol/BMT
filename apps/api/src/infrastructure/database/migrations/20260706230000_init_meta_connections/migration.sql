-- Create Table: meta_connections
CREATE TABLE "meta_connections" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "facebook_user_id" VARCHAR NOT NULL,
    "facebook_user_name" VARCHAR NOT NULL,
    "encrypted_access_token" VARCHAR NOT NULL,
    "expires_at" TIMESTAMPTZ NOT NULL,
    "granted_scopes" JSONB NOT NULL,
    "provider" VARCHAR NOT NULL DEFAULT 'meta',
    "status" VARCHAR NOT NULL DEFAULT 'ACTIVE',
    "connected_by" UUID NOT NULL,
    "organization_id" UUID NOT NULL,
    "workspace_id" UUID NOT NULL,
    "last_validated_at" TIMESTAMPTZ NOT NULL,
    "connection_version" INT NOT NULL DEFAULT 1,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "pk_meta_connections" PRIMARY KEY ("id"),
    CONSTRAINT "fk_meta_connections_users_connected_by" FOREIGN KEY ("connected_by") REFERENCES "users"("id") ON DELETE CASCADE,
    CONSTRAINT "fk_meta_connections_organizations_organization_id" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE CASCADE,
    CONSTRAINT "fk_meta_connections_workspaces_workspace_id" FOREIGN KEY ("workspace_id") REFERENCES "workspaces"("id") ON DELETE CASCADE
);

-- Create Unique Index
CREATE UNIQUE INDEX "udx_meta_connections_workspace_id_provider" ON "meta_connections"("workspace_id", "provider");
