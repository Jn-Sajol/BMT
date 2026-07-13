# Database Infrastructure Directory

This directory stores database connection adapters, schema files, SQL migration tasks, and seed configurations.

## Folder Layout

```
database/
├── prisma/                  # Prisma Client schema configuration definitions
├── migrations/              # SQL structural migration scripts (versioned chronologically)
├── seeds/                   # Baseline and demo workspace seeding scripts
└── repositories/            # Concrete database query implementations (implements common/ports)
```
