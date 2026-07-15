# BMT — Application Navigation Map

This map outlines the flow of user views across the platform.

---

## 1. Flow Diagram

```
[ Login Page ]
      |
      v
[ Workspace Selection Screen ]
      |
      +------------------------+------------------------+
      |                                                 |
  [ SAFE Mode ]                                 [ ADVANCED Mode ]
      |                                                 |
      +---> [ Dashboard (Read-Only) ]                   +---> [ Workflow Designer (Canvas) ]
      |                                                 |
      +---> [ Campaign Analytics ]                      +---> [ Template Marketplace ]
      |                                                 |
      +---> [ Recommendations Advisory ]                +---> [ Execution History Logs ]
      |                                                 |
      +---> [ Notification Settings ]                   +---> [ Settings & API Keys ]
```

---

## 2. Access Scope Permissions
*   **SAFE View:** Users with `READ_ONLY` member flags are restricted to SAFE Mode routes and cannot access ADVANCED canvas configurations.
*   **ADVANCED View:** Workspace owners and users with `DEVELOPER`/`ADMIN` roles can access ADVANCED automation features.
