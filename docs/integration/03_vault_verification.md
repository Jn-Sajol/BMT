# 03 Vault Verification — IV-01

## 1. AES-256-GCM Verification
*   Tests verify encryption and decryption cycles.
*   Authenticity tag checks prevent tampering with credentials.

## 2. Leakage Audits
*   Secrets are resolved dynamically in memory during execution.
*   No plaintext secrets are saved in browser local storage or workflow files.
