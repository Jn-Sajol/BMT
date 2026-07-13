# BMT Platform — Release Versioning Strategy

BMT adopts standard Semantic Versioning (SemVer) version rules to manage releases.

---

## 1. SemVer Specifications
Versions take the form:
$$\text{Version} = \text{Major} \cdot \text{Minor} \cdot \text{Patch}$$
*   **Major version changes:** Breaking API changes (e.g., database schema modifications).
*   **Minor version changes:** New backward-compatible feature additions (e.g., new recommendation providers).
*   **Patch version changes:** Backward-compatible bug fixes and security hotfixes.

---

## 2. Release Branches & Workflow
*   `main`: Main repository containing active staging releases.
*   `release/*`: Release candidate branches for production validations.
*   `hotfix/*`: Quick patch paths directly merged back to release branches and main.
