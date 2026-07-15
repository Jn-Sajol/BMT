# BMT — Repository Governance

This document describes repository governance rules, access levels, and change approvals.

---

## 1. Role Classifications
*   **Maintainers:** Full push permissions to the repository. Responsible for release merges.
*   **Contributors:** Fork code and submit PRs off the `develop` branch.
*   **Advisors:** Perform architecture audits and validation assessments.

## 2. Review & Approval Policy
*   All pull requests must receive at least **two approvals** from code owners (as declared in `CODEOWNERS`) before merge eligibility.
*   All automated CI pipeline checks must pass.
