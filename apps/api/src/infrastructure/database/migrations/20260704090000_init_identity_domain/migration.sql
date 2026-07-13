-- Create Table: users
CREATE TABLE "users" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "email" VARCHAR NOT NULL,
    "name" VARCHAR,
    "password_hash" VARCHAR NOT NULL,
    "status" VARCHAR NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMPTZ,

    CONSTRAINT "pk_users" PRIMARY KEY ("id")
);

-- Create Table: user_sessions
CREATE TABLE "user_sessions" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "token_hash" VARCHAR NOT NULL,
    "ip_address" VARCHAR,
    "user_agent" VARCHAR,
    "expires_at" TIMESTAMPTZ NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "pk_user_sessions" PRIMARY KEY ("id"),
    CONSTRAINT "fk_user_sessions_users_user_id" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE
);

-- Create Table: user_invitations
CREATE TABLE "user_invitations" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "email" VARCHAR NOT NULL,
    "tenant_id" UUID,
    "workspace_id" UUID,
    "role_id" UUID,
    "token_hash" VARCHAR NOT NULL,
    "status" VARCHAR NOT NULL DEFAULT 'PENDING',
    "expires_at" TIMESTAMPTZ NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMPTZ,
    "created_by" UUID,
    "updated_by" UUID,

    CONSTRAINT "pk_user_invitations" PRIMARY KEY ("id"),
    CONSTRAINT "fk_user_invitations_users_created_by" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE SET NULL
);

-- Create Unique Indexes
CREATE UNIQUE INDEX "udx_users_email" ON "users"("email");
CREATE UNIQUE INDEX "udx_user_sessions_token_hash" ON "user_sessions"("token_hash");
CREATE UNIQUE INDEX "udx_user_invitations_token_hash" ON "user_invitations"("token_hash");

-- Create Performance Indexes
CREATE INDEX "idx_user_sessions_user_id" ON "user_sessions"("user_id");
CREATE INDEX "idx_user_invitations_email" ON "user_invitations"("email");
CREATE INDEX "idx_user_invitations_tenant_id" ON "user_invitations"("tenant_id");
