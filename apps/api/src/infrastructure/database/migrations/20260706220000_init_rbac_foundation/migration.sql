-- Create Table: roles
CREATE TABLE "roles" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" VARCHAR NOT NULL,
    "description" TEXT NOT NULL,
    "role_type" VARCHAR NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "pk_roles" PRIMARY KEY ("id")
);

-- Create Unique Index
CREATE UNIQUE INDEX "udx_roles_name" ON "roles"("name");

-- Create Table: permissions
CREATE TABLE "permissions" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "action_key" VARCHAR NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "pk_permissions" PRIMARY KEY ("id")
);

-- Create Unique Index
CREATE UNIQUE INDEX "udx_permissions_action_key" ON "permissions"("action_key");

-- Create Table: role_permissions
CREATE TABLE "role_permissions" (
    "role_id" UUID NOT NULL,
    "permission_id" UUID NOT NULL,

    CONSTRAINT "pk_role_permissions" PRIMARY KEY ("role_id", "permission_id"),
    CONSTRAINT "fk_role_permissions_roles_role_id" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE CASCADE,
    CONSTRAINT "fk_role_permissions_permissions_permission_id" FOREIGN KEY ("permission_id") REFERENCES "permissions"("id") ON DELETE CASCADE
);

-- Create Table: user_workspace_roles
CREATE TABLE "user_workspace_roles" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "workspace_id" UUID NOT NULL,
    "role_id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "pk_user_workspace_roles" PRIMARY KEY ("id"),
    CONSTRAINT "fk_user_workspace_roles_users_user_id" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE,
    CONSTRAINT "fk_user_workspace_roles_workspaces_workspace_id" FOREIGN KEY ("workspace_id") REFERENCES "workspaces"("id") ON DELETE CASCADE,
    CONSTRAINT "fk_user_workspace_roles_roles_role_id" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE CASCADE
);

-- Create Unique Index
CREATE UNIQUE INDEX "udx_user_workspace_roles_keys" ON "user_workspace_roles"("user_id", "workspace_id", "role_id");

-- Alter Table: organization_members
ALTER TABLE "organization_members"
ADD COLUMN "role_id" UUID,
ADD CONSTRAINT "fk_organization_members_roles_role_id" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE SET NULL;
