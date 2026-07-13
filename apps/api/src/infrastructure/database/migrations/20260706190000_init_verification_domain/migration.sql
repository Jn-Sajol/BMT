-- Alter Table: users
ALTER TABLE "users" ADD COLUMN "email_verified_at" TIMESTAMPTZ;

-- Create Table: verification_tokens
CREATE TABLE "verification_tokens" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "token_hash" VARCHAR NOT NULL,
    "token_type" VARCHAR NOT NULL,
    "expires_at" TIMESTAMPTZ NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "used_at" TIMESTAMPTZ,

    CONSTRAINT "pk_verification_tokens" PRIMARY KEY ("id"),
    CONSTRAINT "fk_verification_tokens_users_user_id" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE
);

-- Create Unique Index
CREATE UNIQUE INDEX "udx_verification_tokens_token_hash" ON "verification_tokens"("token_hash");
