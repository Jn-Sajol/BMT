# BMT Platform — Backup, Restore & Rollback Validation

This document describes the validation of database backup, restoration, and container rollback commands.

---

## 1. Database Backup Verification
*   **Command:**
    ```bash
    pg_dump -h $DB_HOST -U $DB_USER -d $DB_NAME -F c -b -v -f backup_file.dump
    ```
*   **Validation status:** Successful. Schema DDL is completely captured.

---

## 2. Restoration Verification
*   **Command:**
    ```bash
    pg_restore -h $DB_HOST -U $DB_USER -d $DB_NAME -v backup_file.dump
    ```
*   **Validation status:** Clean restore verified. Schema structure matches pre-backup states.

---

## 3. Rollback Strategies
*   **Database Rollbacks:** Supported by migration files. Rollback SQL files are archived under `prisma/migrations`.
*   **Helm Rollback:**
    ```bash
    helm rollback bmt-release <previous-revision-number> --namespace bmt-prod
    ```
