export enum PermissionCode {
  // Facebook module
  FACEBOOK_PAGE_READ = 'facebook.page.read',
  FACEBOOK_PAGE_WRITE = 'facebook.page.write',
  FACEBOOK_ADS_MANAGE = 'facebook.ads.manage',

  // Campaign module
  CAMPAIGN_CREATE = 'campaign.create',
  CAMPAIGN_READ = 'campaign.read',
  CAMPAIGN_UPDATE = 'campaign.update',
  CAMPAIGN_DELETE = 'campaign.delete',

  // Workspace members module
  WORKSPACE_MEMBER_INVITE = 'workspace.member.invite',
  WORKSPACE_MEMBER_REMOVE = 'workspace.member.remove',
  WORKSPACE_MEMBER_UPDATE = 'workspace.member.update',

  // Organization members module
  ORGANIZATION_MEMBER_INVITE = 'organization.member.invite',
  ORGANIZATION_MEMBER_REMOVE = 'organization.member.remove',
  ORGANIZATION_MEMBER_UPDATE = 'organization.member.update',

  // Browser automation module
  BROWSER_SESSION_CREATE = 'browser.session.create',
  BROWSER_SESSION_READ = 'browser.session.read',
  BROWSER_SESSION_DELETE = 'browser.session.delete',

  // Workspace settings
  WORKSPACE_SETTINGS_UPDATE = 'workspace.settings.update',
  WORKSPACE_DELETE = 'workspace.delete',

  // Organization settings
  ORGANIZATION_SETTINGS_UPDATE = 'organization.settings.update',
  ORGANIZATION_DELETE = 'organization.delete',
  ORGANIZATION_BILLING_MANAGE = 'organization.billing.manage',
}
