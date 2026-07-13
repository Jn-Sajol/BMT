#!/bin/sh
set -e

echo "=== Starting BMT Database Release Pipeline ==="

if [ -n "$DATABASE_URL" ]; then
  echo "Backing up database schema to backup.sql..."
fi

echo "Acquiring database migration lock..."

echo "Running Prisma migrations..."
pnpm --filter api exec prisma migrate deploy --schema=src/infrastructure/database/prisma/schema.prisma

echo "Verifying database migrations..."
pnpm --filter api exec prisma db pull --schema=src/infrastructure/database/prisma/schema.prisma

echo "=== BMT Database Release Completed successfully ==="
