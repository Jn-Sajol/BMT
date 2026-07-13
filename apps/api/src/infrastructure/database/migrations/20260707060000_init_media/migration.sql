-- Create Table: media_folders
CREATE TABLE "media_folders" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "workspace_id" UUID NOT NULL,
    "parent_id" UUID,
    "name" VARCHAR NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMPTZ,

    CONSTRAINT "pk_media_folders" PRIMARY KEY ("id"),
    CONSTRAINT "fk_media_folders_workspaces_workspace_id" FOREIGN KEY ("workspace_id") REFERENCES "workspaces"("id") ON DELETE CASCADE,
    CONSTRAINT "fk_media_folders_media_folders_parent_id" FOREIGN KEY ("parent_id") REFERENCES "media_folders"("id") ON DELETE CASCADE
);

-- Create Table: media_assets
CREATE TABLE "media_assets" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "workspace_id" UUID NOT NULL,
    "folder_id" UUID,
    "type" VARCHAR NOT NULL,
    "name" VARCHAR NOT NULL,
    "original_filename" VARCHAR NOT NULL,
    "mime_type" VARCHAR NOT NULL,
    "extension" VARCHAR NOT NULL,
    "size" INT NOT NULL,
    "width" INT,
    "height" INT,
    "duration" INT,
    "storage_provider" VARCHAR NOT NULL,
    "storage_key" VARCHAR NOT NULL,
    "public_url" VARCHAR NOT NULL,
    "thumbnail_url" VARCHAR,
    "meta_image_hash" VARCHAR,
    "meta_video_id" VARCHAR,
    "processing_status" VARCHAR NOT NULL DEFAULT 'PENDING',
    "upload_status" VARCHAR NOT NULL DEFAULT 'PENDING',
    "checksum" VARCHAR NOT NULL,
    "metadata" JSONB NOT NULL,
    "created_by" UUID NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMPTZ,

    CONSTRAINT "pk_media_assets" PRIMARY KEY ("id"),
    CONSTRAINT "fk_media_assets_workspaces_workspace_id" FOREIGN KEY ("workspace_id") REFERENCES "workspaces"("id") ON DELETE CASCADE,
    CONSTRAINT "fk_media_assets_media_folders_folder_id" FOREIGN KEY ("folder_id") REFERENCES "media_folders"("id") ON DELETE SET NULL,
    CONSTRAINT "fk_media_assets_users_created_by" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE CASCADE
);

-- Create Table: media_tags
CREATE TABLE "media_tags" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "media_asset_id" UUID NOT NULL,
    "name" VARCHAR NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "pk_media_tags" PRIMARY KEY ("id"),
    CONSTRAINT "fk_media_tags_media_assets_media_asset_id" FOREIGN KEY ("media_asset_id") REFERENCES "media_assets"("id") ON DELETE CASCADE
);

-- Create Table: media_histories
CREATE TABLE "media_histories" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "media_asset_id" UUID NOT NULL,
    "version" INT NOT NULL,
    "snapshot" JSONB NOT NULL,
    "author_id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "pk_media_histories" PRIMARY KEY ("id"),
    CONSTRAINT "fk_media_histories_media_assets_media_asset_id" FOREIGN KEY ("media_asset_id") REFERENCES "media_assets"("id") ON DELETE CASCADE,
    CONSTRAINT "fk_media_histories_users_author_id" FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE CASCADE
);
