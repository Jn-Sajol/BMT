// Global Shared Types Placeholder for mOS Monorepo

export interface TenantInfo {
  id: string;
  name: string;
  slug: string;
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
}

export interface WorkspaceInfo {
  id: string;
  tenantId: string;
  name: string;
  workspaceType: string;
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: 'Admin' | 'Creator' | 'Viewer';
}
