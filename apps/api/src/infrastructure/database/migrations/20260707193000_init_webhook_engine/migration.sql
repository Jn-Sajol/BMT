-- Create Table webhook_inbox
CREATE TABLE "webhook_inbox" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "provider" VARCHAR NOT NULL,
    "external_id" VARCHAR NOT NULL,
    "idempotency_key" VARCHAR NOT NULL,
    "payload" JSONB NOT NULL,
    "status" VARCHAR NOT NULL DEFAULT 'PENDING',
    "error_message" TEXT,
    "processed_at" TIMESTAMPTZ,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now(),

    CONSTRAINT "pk_webhook_inbox" PRIMARY KEY ("id"),
    CONSTRAINT "uq_webhook_inbox_idempotency_key" UNIQUE ("idempotency_key")
);

CREATE INDEX "idx_webhook_inbox_status" ON "webhook_inbox"("status");
