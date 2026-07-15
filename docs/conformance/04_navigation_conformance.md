# BMT — Navigation Conformance Report

This report confirms that the visual and routing paths follow the Navigation Specification.

---

## 1. Routing Trees Verification

```
[ Root / Login ]
       |
       v
[ Workspace Switcher ]
       |
       +---> [ SAFE Layout: /workspace/:id/safe/dashboard ]
       |
       +---> [ ADVANCED Layout: /workspace/:id/advanced/marketplace ]
```

## 2. Page Transitions & Guards
*   Routing interceptors block user access if the target path does not match their workspace role.
*   SAFE users are restricted from routing to `/workspace/:id/advanced/*` endpoints.
