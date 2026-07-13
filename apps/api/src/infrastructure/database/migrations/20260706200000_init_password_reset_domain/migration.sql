-- Create Table: password_reset_tokens
CREATE TABLE "password_reset_tokens" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "token_hash" VARCHAR NOT NULL,
    "expires_at" TIMESTAMPTZ NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "used_at" TIMESTAMPTZ,

    CONSTRAINT "pk_password_reset_tokens" PRIMARY KEY ("id"),
    CONSTRAINT "fk_password_reset_tokens_users_user_id" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE
);

-- Create Unique Index
CREATE UNIQUE INDEX "udx_password_reset_tokens_token_hash" ON "password_reset_tokens"("token_hash");
